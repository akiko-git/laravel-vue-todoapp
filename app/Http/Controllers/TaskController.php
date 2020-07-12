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
}
