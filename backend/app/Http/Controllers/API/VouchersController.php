<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\VoucherRequest;
use App\Models\Voucher;
use Exception;
use Illuminate\Http\Request;

class VouchersController extends Controller
{
    private $fields = [
        'id',
        'code',
        'discount',
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $vouchers = Voucher::orderBy('created_at', 'desc')
            ->paginate($request->page_size ?? 10, $this->fields);

        $result = response()->json([
            'data' => $vouchers->items(),
            'paging' => [
                'current_page' => $vouchers->currentPage(),
                'per_page' => $vouchers->perPage(),
                'total' => $vouchers->total(),
                'last_page' => $vouchers->lastPage(),
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
    public function store(VoucherRequest $request)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        Voucher::create($request->all());

        return response()->json([
            'message' => 'Create new voucher successfully!',
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
                'message' => 'Get user data successfully!',
                'data' => Voucher::findOrFail($id, $this->fields),
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
    public function update(VoucherRequest $request, $id)
    {
        if (isset($request->validator) && $request->validator->fails()) {
            return response()->json([
                'message' => $request->validator->messages(),
                'status' => 400,
            ], 400);
        }

        try {
            $voucher = Voucher::findOrFail($id, $this->fields);
            $voucher->fill($request->all())->save();

            return response()->json([
                'message' => 'Update voucher successfully!',
                'data' => $voucher,
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid voucher. Please try again!',
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
                'message' => 'Delete voucher successfully!',
                'data' => Voucher::findOrFail($id)->delete(),
                'status' => 200,
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Invalid voucher. Please try again!',
                'status' => 400,
            ], 400);
        }
    }
}
