<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;

class CustomerRequest extends FormRequest
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
            'email' => 'required|email|unique:customers,email,' . (Request::instance()->id ?? ''),
            'password' => Request::instance()->id ? 'nullable' : 'required|confirmed|min:8',
            'address' => 'required',
            'phone' => 'required',
            'avatar' => 'nullable',
        ];
    }
}
