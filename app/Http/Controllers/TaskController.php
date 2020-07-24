<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Task;

class TaskController extends Controller
{
		public function index(){
			$tasks = Task::all();
			//dd($tasks->toArray());
			//return view('todolist.index')->with('tasks',$tasks);
			$tasks = json_encode($tasks);
			return view('todolist.index')->with('tasks',$tasks);
			//return response()->json(['tasks'=>$tasks]);
		}

		public function form(Request $request){
			//dd($request->toArray());
			$tasks = new Task;
			$tasks->title = $request->addTask;
			$res = $request->addTask; 
			$tasks->save();
			return response()->json(['success'=>$tasks]); 
		}

		public function store(){
			$tasks = Task::all();
			return response()->json(['getlist'=>$tasks]);
		}

		public function destroy($id){
			$task = Task::find($id);
			if($task){
				$res = $task->delete();
			}
			return response()->json(['success'=>$res]);
		}
}
