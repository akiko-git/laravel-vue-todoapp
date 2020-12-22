<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Task;

class TaskController extends Controller
{
		public function __construct(){
			$this->middleware('auth:sanctum');
			// $this->middleware('auth');
		}
		
    //タスク一覧表示
		public function store(){
			$tasks = Task::where('user_id',Auth::id())->get();
			// dd($tasks);
			$user = Auth::user();
		// 	$isLogin = "";
		// 	if (Auth::check()) {
		// 		$isLogin =  "ログインOK";
		// }

			return response()->json(['getlist'=>$tasks,'user'=>$user]);
		}

    //タスク登録
		public function form(Request $request){
			// dd($request->toArray());
			$tasks = new Task;
			$tasks->user_id = Auth::id();
			$tasks->title = $request->title;
			$tasks->deadline = $request->deadline;
			$tasks->status = $request->status;
			if($request->project_id){
				$tasks->inbox_flag = 0;
				$tasks->project_id = $request->project_id;
			}else{
				$tasks->inbox_flag = 1;
			}
			$tasks->save();
			return response()->json(['success'=>$tasks]);
		}

		//タスク編集
		public function edit(Request $request,$id){
			$task = Task::find($id);
			if($task){
				$task->title = $request->title;
				$task->deadline = $request->deadline;
				if($request->project_id == null){
					$task->project_id = null;
					$task->inbox_flag = true;
				}else{
					$task->project_id = $request->project_id;
				}
			}
			$task->save();

			return response()->json(['success'=>$task]);
		}

		//タスク削除
		public function destroy($id){
			$task = Task::find($id);
			if($task){
				$res = $task->delete();
			}
			return response()->json(['success'=>$res]);
		}
}
