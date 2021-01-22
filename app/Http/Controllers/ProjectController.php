<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Project;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function __construct(){
        $this->middleware('auth:sanctum');
    }

    //プロジェクト一覧表示
    public function show(){
        $projects = Project::where('user_id',Auth::id())->get();
        //dd($projects);
        // abort(500);
        return response()->json(['getProjectList'=>$projects]);
    }

    //プロジェクト登録
    public function regist(Request $request){
        $projects = new Project;
        $projects->user_id = Auth::id();
        $projects->project = $request->project;
        // abort(500);
        $projects->save();
        return response()->json(['regist'=>$projects],201);
    }

    //プロジェクトの編集
    public function edit(Request $request,$id){
        $project = Project::find($id);
		if($project){
			$project->project = $request->project;
        }else{
            return;
        }
        $project->save();
        return response()->json(['edit'=>$project]);
    }

	//プロジェクト削除
	public function destroy($id){
		$project = Project::find($id);
		if($project){
            $res = $project->delete();
            return response()->json(['delete'=>$res]);
        }
        return null;
	}
}
