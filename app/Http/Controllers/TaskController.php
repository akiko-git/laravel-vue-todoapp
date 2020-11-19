<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;

class TaskController extends Controller
{
		// public function index(){
		// 	$tasks = Task::all();
		// 	//dd($tasks->toArray());
		// 	//return view('todolist.index')->with('tasks',$tasks);
		// 	dd($tasks);
		// 	$tasks = json_encode($tasks);
		// 	return view('todolist.index')->with('tasks',$tasks);
		// 	//return response()->json(['tasks'=>$tasks]);
		// }

    //タスク一覧表示
		public function store(){
			$tasks = Task::all();
			//dd($tasks);
			return response()->json(['getlist'=>$tasks]);
		}

    //タスク登録
		public function form(Request $request){
			//dd($request->toArray());
			$tasks = new Task;
			$tasks->title = $request->title;
			$tasks->text = $request->text;
			$tasks->deadline = $request->deadline;
			if($request->project_id){
				$tasks->project_id = $request->project_id;
			}
			// $res = $request->addTask;
			$tasks->save();
			return response()->json(['success'=>$tasks]);
		}

		//タスク編集
		public function edit(Request $request,$id){
			$task = Task::find($id);
			if($task){
				$task->title = $request->title;
				$task->text = $request->text;
				$task->deadline = $request->deadline;
				$task->project_id = $request->project_id;
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
