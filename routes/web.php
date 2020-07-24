<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*Route::get('/', function () {
    return view('welcome');
});
 */

Auth::routes();

//Route::get('/home', 'HomeController@index')->name('home');
Route::get('/todolist', 'TaskController@index')->name('task');
Route::get('/todolist/store', 'TaskController@store')->name('store');
Route::post('/todolist/form', 'TaskController@form')->name('form');
//Route::post('/todolist/form', function(){dd(request()->all());});
