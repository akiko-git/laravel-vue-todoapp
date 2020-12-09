<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    //ログイン
    public function login(Request $request){
        $credentials = $request->only('email', 'password');
        // $credentials = $request->validate([
        //     'name' => 'required|string',
        //     'email' => 'required|email',
        //     'password' => 'required'
        // ]);

        if (Auth::attempt($credentials)) {
            // 認証に成功
            return response()->json(['message' => 'ログインしたよ'], 200);
        }else{
            return response()->json(['error' => 'Unauthorized'], 401);
        }


    }

    //ログアウト
    public function logout(){
        Auth::logout();
        return response()->json(['message' => 'ログアウトしました'], 200);
    }
}
