(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ProjectDialog.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/ProjectDialog.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      dialog: false,
      addProject: ""
    };
  },
  props: {
    dialogTitle: {
      type: String,
      "default": "追加" //required: true,

    },
    dialogBtnText: {
      type: String,
      "default": "追加"
    },
    editData: Object
  },
  methods: {
    open: function open() {
      this.dialog = true;
    },
    close: function close() {
      this.dialog = false;
      this.$emit("close");
    },
    //フォーム送信
    submitProject: function submitProject() {
      if (this.editData) {
        this.editProject();
      } else {
        this.registProject();
      }
    },
    getEditData: function getEditData() {
      if (this.editData) {
        this.addProject = this.editData.project;
      }
    },
    //プロジェクトを登録
    registProject: function registProject() {
      var dataform = new FormData();
      dataform.append("addProject", this.addProject);
      axios.post("http://localhost:8001/api/project/regist", dataform).then(function (res) {
        console.log(res.data.regist); //this.lists.push(res.data.regist);
      });
      this.close();
      this.$emit("regist");
      this.addProject = null;
    },
    //プロジェクトを編集
    editProject: function editProject() {
      var dataform = new FormData();
      dataform.append("addProject", this.addProject);
      dataform.append("editId", this.editData.id);
      axios.post("http://localhost:8001/api/project/edit", dataform).then(function (res) {
        console.log(res.data.edit);
      });
      this.close();
      this.$emit("regist"); //this.addProject = null;
    }
  },
  computed: {
    addText: function addText() {
      if (this.addProject) {
        return false;
      } else {
        return true;
      }
    }
  },
  created: function created() {
    this.getEditData();
  }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ProjectDialog.vue?vue&type=template&id=4d9bde34&":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/ProjectDialog.vue?vue&type=template&id=4d9bde34& ***!
  \****************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-dialog",
    {
      attrs: { persistent: "", "max-width": "600px" },
      scopedSlots: _vm._u(
        [
          {
            key: "activator",
            fn: function(ref) {
              var on = ref.on
              var attrs = ref.attrs
              return [_vm._t("activator", null, { on: { click: _vm.open } })]
            }
          }
        ],
        null,
        true
      ),
      model: {
        value: _vm.dialog,
        callback: function($$v) {
          _vm.dialog = $$v
        },
        expression: "dialog"
      }
    },
    [
      _vm._v(" "),
      _c(
        "v-card",
        [
          _c("v-card-title", [
            _vm._v("プロジェクトを" + _vm._s(_vm.dialogTitle))
          ]),
          _vm._v(" "),
          _c("v-divider"),
          _vm._v(" "),
          _c(
            "form",
            {
              on: {
                submit: function($event) {
                  $event.preventDefault()
                  return _vm.submitProject()
                }
              }
            },
            [
              _c(
                "v-card-text",
                [
                  _c("v-text-field", {
                    attrs: { counter: 20 },
                    on: {
                      keydown: function($event) {
                        if (
                          !$event.type.indexOf("key") &&
                          _vm._k(
                            $event.keyCode,
                            "enter",
                            13,
                            $event.key,
                            "Enter"
                          )
                        ) {
                          return null
                        }
                        if (
                          $event.ctrlKey ||
                          $event.shiftKey ||
                          $event.altKey ||
                          $event.metaKey
                        ) {
                          return null
                        }
                        return _vm.submitProject()
                      }
                    },
                    model: {
                      value: _vm.addProject,
                      callback: function($$v) {
                        _vm.addProject = $$v
                      },
                      expression: "addProject"
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-card-actions",
                [
                  _c(
                    "v-btn",
                    {
                      attrs: { color: "blue darken-1", text: "" },
                      on: { click: _vm.close }
                    },
                    [_vm._v("キャンセル")]
                  ),
                  _vm._v(" "),
                  _c(
                    "v-btn",
                    {
                      attrs: {
                        type: "submit",
                        color: "blue darken-1",
                        text: "",
                        disabled: _vm.addText
                      }
                    },
                    [_vm._v(_vm._s(_vm.dialogBtnText))]
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./resources/js/components/ProjectDialog.vue":
/*!***************************************************!*\
  !*** ./resources/js/components/ProjectDialog.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ProjectDialog_vue_vue_type_template_id_4d9bde34___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProjectDialog.vue?vue&type=template&id=4d9bde34& */ "./resources/js/components/ProjectDialog.vue?vue&type=template&id=4d9bde34&");
/* harmony import */ var _ProjectDialog_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProjectDialog.vue?vue&type=script&lang=js& */ "./resources/js/components/ProjectDialog.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ProjectDialog_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ProjectDialog_vue_vue_type_template_id_4d9bde34___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ProjectDialog_vue_vue_type_template_id_4d9bde34___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/ProjectDialog.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/ProjectDialog.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./resources/js/components/ProjectDialog.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProjectDialog_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ProjectDialog.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ProjectDialog.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProjectDialog_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/ProjectDialog.vue?vue&type=template&id=4d9bde34&":
/*!**********************************************************************************!*\
  !*** ./resources/js/components/ProjectDialog.vue?vue&type=template&id=4d9bde34& ***!
  \**********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProjectDialog_vue_vue_type_template_id_4d9bde34___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./ProjectDialog.vue?vue&type=template&id=4d9bde34& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ProjectDialog.vue?vue&type=template&id=4d9bde34&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProjectDialog_vue_vue_type_template_id_4d9bde34___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProjectDialog_vue_vue_type_template_id_4d9bde34___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);