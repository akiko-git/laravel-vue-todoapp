<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title'];

    public function project(){
        return $this->belongsTo('App\Project');
    } 
}
