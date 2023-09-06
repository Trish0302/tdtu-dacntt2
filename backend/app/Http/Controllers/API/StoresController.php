<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImportFileRequest;
use App\Http\Requests\StoreRequest;
use App\Models\Store;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class StoresController extends Controller
{
    private $user_fields = [
        'id',
        'name',
        'email',
        'phone',
        'avatar',
    ];

    private $store_fields = [
        'id',
        'avatar',
        'name',
        'address',
        'description',
        'user_id',
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = $request->q;

        $stores = Store::where('name', 'like', '%' . $query . '%')
            ->orWhere('address', 'like', '%' . $query . '%')
            ->orWhere('id', $query)
            ->select($this->store_fields)
            ->with(['user' => function ($q) {
                $q->select($this->user_fields);
            }])
            ->orWhereHas('user', function ($q) use ($query) {
                return $q->where('users.name', $query);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->page_size ?? 10);

        $result = response()->json([
            'data' => $stores->items(),
            'paging' => [
                'current_page' => $stores->currentPage(),
                'per_page' => $stores->perPage(),
                'total' => $stores->total(),
                'last_page' => $stores->lastPage(),
            ],
            'status' => 200,
        ], 200);

        return $result;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        if ($request->hasFile('avatar')) {
            $uploaded_file_name = $request->file('avatar')->getClientOriginalName();
            $avatar_name = pathinfo($uploaded_file_name, PATHINFO_FILENAME) . '_' . time();

            $result = $request->file('avatar')->storeOnCloudinaryAs('store', $avatar_name);
            $avatar = $result->getSecurePath();
        } else {
            $avatar = 'https://res.cloudinary.com/ddusqwv7k/image/upload/v1688648527/users/default-avatar_1688648526.png';
        }

        Store::create([
            'name' => $request->name,
            'avatar' => $avatar,
            'address' => $request->address,
            'description' => $request->description,
            'user_id' => $request->user_id,
        ]);

        return response()->json([
            'message' => 'Create new store successfully!',
            'data' => true,
            'status' => 200,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            return response()->json([
                'message' => 'Get store data successfully!',
                'data' => Store::with('user')->find($id),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid store. Please try again!',
                'status' => 400,
            ], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StoreRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        try {
            $store = Store::findOrFail($request->id, $this->store_fields);

            if ($request->hasFile('avatar')) {
                $uploaded_file_name = $request->file('avatar')->getClientOriginalName();
                $avatar_name = pathinfo($uploaded_file_name, PATHINFO_FILENAME) . '_' . time();

                $result = $request->file('avatar')->storeOnCloudinaryAs('store', $avatar_name);
                $avatar = $result->getSecurePath();
            } else {
                $avatar = $store->avatar;
            }

            $store->name = $request->name;
            $store->address = $request->address;
            $store->description = $request->description;
            $store->user_id = $request->user_id;
            $store->avatar = $avatar;

            $store->save();

            return response()->json([
                'message' => 'Update store successfully!',
                'data' => $store,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid store. Please try again!',
                'status' => 400,
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            return response()->json([
                'message' => 'Delete store successfully!',
                'data' => Store::findOrFail($id)->delete(),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid store. Please try again!',
                'status' => 400,
            ], 400);
        }
    }

    public function import(ImportFileRequest $request)
    {
        $reader =  new \PhpOffice\PhpSpreadsheet\Reader\Xlsx();
        $spreadsheet = $reader->load($request->file);
        $worksheet = $spreadsheet->getActiveSheet()->toArray();

        $header = array_shift($worksheet);
        $content['row'] = $this->toKeyedRows($worksheet, $header);

        $request = new Request($content);
        $validator = Validator::make(
            $request->all(),
            array_fill_keys(array_map(function ($value) {
                return 'row.*.' . $value;
            }, ['name', 'address', 'description']), 'required')
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $stores = array_map(function ($row) {
            $row += [
                'user_id' => Auth::user()->id,
                'avatar' => "https://res.cloudinary.com/ddusqwv7k/image/upload/v1688648527/users/default-avatar_1688648526.png",
            ];
            return $row;
        }, $request->row);

        $result = Store::insert($stores);

        return response()->json([
            'message' => 'Import Excel data successfully!',
            'data' => $result,
            'status' => 200,
        ], 200);
    }

    private function toKeyedRows(array $rows, array $header): array
    {
        array_walk($header, function ($value, $key) {
            $value = $value ?: $key;
        });

        array_walk($rows, function (&$row) use ($header) {
            $row = array_combine($header, $row);
        });

        return $rows;
    }
}
