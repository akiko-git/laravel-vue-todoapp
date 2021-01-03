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
			if($tasks->status){
				$tasks->status = $request->status;
			}else{
				$tasks->status = 1;
			}
			if($request->project_id && is_array($request->project_id) === false){
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
				$task->status = $request->status;
				if($request->project_id == null){
					$task->project_id = null;
					$task->inbox_flag = 1;
				}else{
					$task->project_id = $request->project_id;
					$task->inbox_flag = 0;
				}
			}
			$task->save();

			return response()->json(['success'=>$task]);
		}

		//タスクの完了
		public function doneTask(Request $request){
			$task = Task::find($request->id);
			// dd($task);
			if($task){
				$task->status = 2;
			}
			$task->save();

			return response()->json(['success'=>$task]);
		}

		public function test(Request $request){
			return response()->json(['success'=>$request]);
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
