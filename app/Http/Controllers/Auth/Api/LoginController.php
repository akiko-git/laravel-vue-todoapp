<?php

namespace App\Http\Controllers\Auth\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    //ログイン
    public function login(Request $request){
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8']
        ]);

        if (Auth::attempt($credentials)) {
            // 認証に成功
            return response()->json(['message' => 'ログインしたよ'], 200);
        }else{
            return response()->json(['error' => 'Unauthorized'], 401);
        }


    }

    // protected function validator(array $data)
    // {
    //     return Validator::make($data, [
    //         'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
    //         'password' => ['required', 'string', 'min:8'],
    //     ]);
    // }

    //ログアウト
    public function logout(){
        Auth::logout();
        return response()->json(['message' => 'ログアウトしました'], 200);
    }
}
