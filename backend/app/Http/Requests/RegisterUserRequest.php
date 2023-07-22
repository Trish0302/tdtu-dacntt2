<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;

class RegisterUserRequest extends FormRequest
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
        if (Request::instance()->update_password == true) {
            return [
                'password' => 'required|confirmed|min:8',
                'current_password' => 'required|password',
            ];
        }

        return [
            'id' => 'exists:users,id',
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . (Request::instance()->id ?? ''),
            'password' => Request::instance()->id ? 'nullable' : 'required|confirmed|min:8',
            'phone' => 'required',
            'avatar' => 'nullable',
        ];
    }

    public $validator = null;
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        $this->validator = $validator;
    }
}
