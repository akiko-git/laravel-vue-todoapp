<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});

// Route::get('/todolist', 'TaskController@index')->name('task');
Route::get('/todolist/store', 'TaskController@store')->name('store');
Route::post('/todolist/form', 'TaskController@form')->name('form');
Route::delete('/todolist/delete{id}', 'TaskController@destroy');
Route::get('/project/show', 'ProjectController@show');
Route::post('/project/regist', 'ProjectController@regist');
Route::post('/project/edit', 'ProjectController@edit');
Route::delete('/project/delete{id}', 'ProjectController@destroy');
