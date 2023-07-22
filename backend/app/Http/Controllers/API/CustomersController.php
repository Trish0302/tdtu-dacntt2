<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustomersController extends Controller
{
    private $fields = [
        'id',
        'name',
        'email',
        'phone',
        'avatar',
        'address',
        'created_at',
        'updated_at',
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $customers = Customer::orderBy('created_at', 'desc')
            ->paginate($request->page_size ?? 10, $this->fields);

        return response()->json([
            'message' => 'Get customer list successfully!',
            'data' => $customers->items(),
            'paging' => [
                'current_page' => $customers->currentPage(),
                'per_page' => $customers->perPage(),
                'total' => $customers->total(),
                'last_page' => $customers->lastPage(),
            ],
            'status' => 200,
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CustomerRequest $request)
    {
        if ($request->hasFile('avatar')) {
            $uploaded_file_name = $request->file('avatar')->getClientOriginalName();
            $avatar_name = pathinfo($uploaded_file_name, PATHINFO_FILENAME) . '_' . time();

            $result = $request->file('avatar')->storeOnCloudinaryAs('customers', $avatar_name);
            $avatar = $result->getSecurePath();
        } else {
            $avatar = 'https://res.cloudinary.com/ddusqwv7k/image/upload/v1688648527/users/default-avatar_1688648526.png';
        }

        Customer::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => $avatar,
            'phone' => $request->phone,
            'address' => $request->address,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Create new customer successfully!',
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
                'message' => 'Get customer information successfully!',
                'data' => Customer::findOrFail($id, $this->fields),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid user. Please try again!',
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
    public function update(CustomerRequest $request, $id)
    {
        try {
            $customer = Customer::findOrFail($id, $this->fields);

            if ($request->hasFile('avatar')) {
                $uploaded_file_name = $request->file('avatar')->getClientOriginalName();
                $avatar_name = pathinfo($uploaded_file_name, PATHINFO_FILENAME) . '_' . time();

                $result = $request->file('avatar')->storeOnCloudinaryAs('users', $avatar_name);
                $avatar = $result->getSecurePath();
            } else {
                $avatar = $customer->avatar;
            }

            $customer->update([
                'name' => $request->name,
                'email' => $request->email,
                'avatar' => $avatar,
                'phone' => $request->phone,
                'address' => $request->address,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'message' => 'Update customer successfully!',
                'data' => $customer,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid customer. Please try again!',
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
                'message' => 'Delete customer successfully!',
                'data' => Customer::findOrFail($id)->delete(),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid customer. Please try again!',
                'status' => 400,
            ], 400);
        }
    }
}
