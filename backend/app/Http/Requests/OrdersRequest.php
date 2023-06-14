<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrdersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'address' => 'required',
            'phone' => 'required|numeric',
            'store_id' => 'required|exists:stores,id',
            'voucher_id' => 'required|exists:vouchers,id',
            'items.*.id' => 'required|exists:food,id',
            'items.*.quantity' => 'required|numeric',
            'items.*.price' => 'required|numeric',
        ];
    }
}
