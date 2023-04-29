<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Request;

class FoodGroupRequest extends FormRequest
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
            'id' => Request::instance()->id ? 'exists:food_groups,id' : '',
            'name' => 'required',
            'slug' => 'required|unique:food_groups,slug,' . (Request::instance()->id ?? ''),
            'description' => 'required',
            'store_id' => 'required|exists:stores,id',
        ];
    }
}
