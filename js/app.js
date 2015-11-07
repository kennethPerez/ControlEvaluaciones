angular.module("app", ["ngRoute"])
    .config(function($routeProvider){
        $routeProvider
            .when("/", {
                controller: "loginController",
                controllerAs: "vm",
                templateUrl: "Vistas/Login.html"
            })
            .when("/professor", {
                controller: "professorController",
                controllerAs: "vm",
                templateUrl: "Vistas/Professor.html"
            })
            .when("/student", {
                controller: "studentController",
                controllerAs: "vm",
                templateUrl: "Vistas/Student.html"
            })
            .otherwise({
                redirectTo: "/"
            });
    })
    
    .factory('Data', function () {
        var info = {};
        return info;
    })
    
    .controller("loginController", function($scope, $http, $location, Data) {
        $scope.error = '';
        $scope.user = "2-0562-0727";
        $scope.pass = "12345";
        
        $scope.Login = function() 
        {        
            $http.get('./BD/Login.php?cedula='+$scope.user+"&pass="+$scope.pass)
                .success(function(response)
                {   
                    if(response !== "Error")
                    {   
                        Data.info = response;
                        if(response.tipo === "P")
                        {                            
                            $location.path('/professor');
                        }
                        else if(response.tipo === "E")
                        {
                            $location.path('/student');
                        }
                        else
                        {
                            $scope.error = 'Error en la conexion.';
                        }
                    }
                    else
                    {
                        $scope.error = 'Login incorrecto.';
                    }
                });
        };
    })
    
    .controller("professorController", function($scope, $http, $location, $timeout, Data, $compile){
        $scope.rowSelected = 0;
        $scope.info = Data.info;
        $scope.MisCursos = {};
        $scope.evaluacionesCurso = [];
        $scope.historialNotas = {};
        $scope.cursoNombre = '';
        $scope.idGrupo = '';
        $scope.nombreEvaluacion = '';
        $scope.porcentajeEvaluacion = 0;
        $scope.porcentajeTotal=0;
        $scope.idEvaluacion = 0;
        $scope.evaluaciones = false;
        $scope.nueva = false;
        $scope.editar = false;
        $scope.error = false;
        $scope.estado = ""; 
        
        $http.get("./BD/getCursos.php?cedula="+$scope.info.cedula)
        .success(function(response) {$scope.MisCursos = response;});

        $scope.logout = function()
        {
            $location.path('/');
        };
        
        $scope.mostrarEvaluaciones = mostrarEvaluaciones;
        $scope.ocultarEvaluaciones = ocultarEvaluaciones;

        function mostrarEvaluaciones(num) {
            if($scope.rowSelected > 0) {
                ocultarEvaluaciones();
            }

            $scope.rowSelected = num;

            var th = document.createElement('th');
            th.setAttribute('colspan', '4');
            var div = document.createElement('div');
            div.setAttribute('class', 'container');
            div.setAttribute('style', 'overflow-y: auto; height: 200px; width: 100%;');
            
            var table = document.createElement('table');
            table.setAttribute('class', 'table table-striped');
            var thead = document.createElement('thead');
            var trEncabezado = document.createElement('tr');
            var rowNombre = document.createElement('th');
            rowNombre.appendChild(document.createTextNode('Nombre'));
            var rowProcentaje = document.createElement('th');
            rowProcentaje.appendChild(document.createTextNode('Porcentaje'));
            var rowEditar = document.createElement('th');
            rowEditar.appendChild(document.createTextNode('Editar'));
            var rowVer = document.createElement('th');
            rowVer.appendChild(document.createTextNode('Ver'));
            var rowCitas = document.createElement('th');
            rowCitas.appendChild(document.createTextNode('Citas de revision'));
            
            if($scope.evaluacionesCurso.length > 0) {
                console.log($scope.evaluacionesCurso.length);
                var tbody = document.createElement('tbody');

                var trCuerpo, nombreCuerpo, porcentajeCuerpo, editarCuerpo, verCuerpo, citasCuerpo, btnEditar, btnVer, btnCitas, spanEditar, spanVer, spanCitas;

                for(var i=0; i<$scope.evaluacionesCurso.length; i++) {
                    trCuerpo = document.createElement('tr');

                    nombreCuerpo = document.createElement('th');
                    nombreCuerpo.appendChild(document.createTextNode($scope.evaluacionesCurso[i].nombre));
                    porcentajeCuerpo = document.createElement('th');
                    porcentajeCuerpo.appendChild(document.createTextNode($scope.evaluacionesCurso[i].porcentaje));
                    editarCuerpo = document.createElement('th');
                    verCuerpo = document.createElement('th');
                    citasCuerpo = document.createElement('th');

                    spanEditar = document.createElement('span');
                    spanEditar.setAttribute('class', 'glyphicon glyphicon-edit');
                    spanVer = document.createElement('span');
                    spanVer.setAttribute('class', 'glyphicon glyphicon-th-list');
                    spanCitas = document.createElement('span');
                    spanCitas.setAttribute('class', 'glyphicon glyphicon-calendar');

                    btnEditar = document.createElement('button');
                    btnEditar.setAttribute('data-toggle', 'modal'); 
                    btnEditar.setAttribute('data-target', '#ManteEvaluaciones'); 
                    btnEditar.setAttribute('class', 'btn'); 
                    
                    btnEditar.setAttribute('ng-click', "editarEvaluacion("+$scope.evaluacionesCurso[i].idevaluacion+","+$scope.evaluacionesCurso[i].nombre+","+$scope.evaluacionesCurso[i].porcentaje+")");
                    
                    btnEditar.appendChild(spanEditar);

                    btnVer = document.createElement('button');
                    btnVer.setAttribute('data-toggle', 'modal'); 
                    btnVer.setAttribute('data-target', '#historialNotas');
                    btnVer.setAttribute('class', 'btn'); 
                    
                    btnVer.setAttribute('ng-click', "verNotas("+$scope.evaluacionesCurso[i].idevaluacion+","+$scope.idGrupo+","+$scope.evaluacionesCurso[i].nombre+","+$scope.evaluacionesCurso[i].porcentaje+")");
                    
                    btnVer.appendChild(spanVer);

                    btnCitas = document.createElement('button');                    
                    btnCitas.setAttribute('class', 'btn');
                    btnCitas.setAttribute('id', 'btn1');
                    
                    btnCitas.setAttribute('ng-click',"citasRevision("+$scope.evaluacionesCurso[i].idevaluacion+")");
                    
                    btnCitas.appendChild(spanCitas);

                    editarCuerpo.appendChild(btnEditar);
                    verCuerpo.appendChild(btnVer);
                    citasCuerpo.appendChild(btnCitas);

                    trCuerpo.appendChild(nombreCuerpo);
                    trCuerpo.appendChild(porcentajeCuerpo);
                    trCuerpo.appendChild(editarCuerpo);
                    trCuerpo.appendChild(verCuerpo);
                    trCuerpo.appendChild(citasCuerpo);

                    tbody.appendChild(trCuerpo);
                }

                table.appendChild(tbody);
            }

            th.appendChild(div);
            div.appendChild(table);
            table.appendChild(thead);
            thead.appendChild(trEncabezado);
            trEncabezado.appendChild(rowNombre);
            trEncabezado.appendChild(rowProcentaje);
            trEncabezado.appendChild(rowEditar);
            trEncabezado.appendChild(rowVer);
            trEncabezado.appendChild(rowCitas);

            var tabla = document.getElementById("tableCursos");
            var rowCursos = tabla.insertRow(num+1);
            rowCursos.appendChild(th);
            /*
            var flechita = table.rows[num].cells[0].firstChild;
            flechita.setAttribute('class', 'glyphicon glyphicon-chevron-down');*/
        }

        function ocultarEvaluaciones() {
            var table = document.getElementById("tableCursos");
            table.deleteRow($scope.rowSelected+1);
            
            /*
            var flechita = table.rows[$scope.rowSelected].cells[0].firstChild;
            flechita.setAttribute('class', 'glyphicon glyphicon-chevron-right');*/

            $scope.rowSelected = 0;
        }
      
                    
        $scope.verEvaluaciones = verEvaluaciones;
        function verEvaluaciones(row, id, nombre)
        {
            $scope.cursoNombre = nombre;
            $scope.idGrupo = id;
            $http.get("./BD/getEvaluacionGrupo.php?grupo="+id)
            .success(function(response) {
                $scope.evaluacionesCurso = response;
                mostrarEvaluaciones(row);
            });
            
            $http.get("./BD/porcentajeTotal.php?grupo="+id)
            .success(function(response) {if(response !== ""){$scope.porcentajeTotal = response;}else{$scope.porcentajeTotal =0;}});

        };
        
        $scope.agregarEvaluacion = function()
        {
            $scope.nueva = true;
            $scope.editar = false;
            $scope.nombreEvaluacion = '';
            $scope.porcentajeEvaluacion = '';
        };
        
        $scope.editarEvaluacion = function(id, n, p)
        {
            console.log("Editar: "+id+ n+p);
            $scope.nueva = false;
            $scope.editar = true;
            $scope.nombreEvaluacion = n;
            $scope.porcentajeEvaluacion = p;
            $scope.idEvaluacion = id;
        };
        
        $scope.$watch('nombreEvaluacion',function() {$scope.validar();});
        $scope.$watch('porcentajeEvaluacion',function() {$scope.validar();});

        $scope.validar = function() 
        {
            if (!$scope.nombreEvaluacion.length || !$scope.porcentajeEvaluacion.length || isNaN($scope.porcentajeEvaluacion) ) 
            {
               $scope.error = true;
            }
            else
            {
               $scope.error = false;
            }
        };
        
        $scope.guardarEvaluacion = function() 
        {
            if($scope.nueva)
            {
                $http.get("./BD/insertarEvaluacion.php?id="+$scope.idGrupo+"&nombre="+$scope.nombreEvaluacion+"&porcentaje="+$scope.porcentajeEvaluacion)
                .success(function(response){
                    if(response==="")
                    {
                        $http.get("./BD/getEvaluacionGrupo.php?grupo="+$scope.idGrupo)
                        .success(function(response) {$scope.evaluacionesCurso = response;});
                
                        $http.get("./BD/porcentajeTotal.php?grupo="+$scope.idGrupo)
                        .success(function(response) {if(response !== ""){$scope.porcentajeTotal = response;}else{$scope.porcentajeTotal =0;}});
                        $scope.nueva = false;
                    }
                    else
                    {
                        alert("Error insertando la evaluacion.");
                    }
                });            
            }
            else
            {
                $http.get("./BD/updateEvaluacion.php?id="+$scope.idEvaluacion+"&nombre="+$scope.nombreEvaluacion+"&porcentaje="+$scope.porcentajeEvaluacion)
                .success(function(response){
                    if(response==="")
                    {
                        $http.get("./BD/getEvaluacionGrupo.php?grupo="+$scope.idGrupo)
                        .success(function(response) {$scope.evaluacionesCurso = response;});
                
                        $http.get("./BD/porcentajeTotal.php?grupo="+$scope.idGrupo)
                        .success(function(response) {if(response !== ""){$scope.porcentajeTotal = response;}else{$scope.porcentajeTotal =0;}});
                        $scope.editar = false;
                    }
                    else
                    {
                        alert("Error actualizando la informacion.");
                    }
                });  


            }
        };
        
        $scope.verNotas = function(id, gr,n,p)
        {
            $scope.nombreEvaluacion = n;
            $scope.porcentajeEvaluacion = p; 
            $scope.idEvaluacion = id;
            
            $http.get("./BD/getHistorialNotas.php?grupo="+gr+"&evaluacion="+id)
            .success(function(response) {$scope.historialNotas = response;});
        };
                
        $scope.guardarCalificacion = function(ced)
        {
            document.getElementById('estado').setAttribute("class","text-danger");
            $scope.estado = "Guardando cambios.";
            $http.get("./BD/insertarCalificacion.php?cedula="+ced+"&evaluacion="+$scope.idEvaluacion+"&nota="+document.getElementById(ced).value)
            .success(function(response) {});
            $timeout(function(){
                document.getElementById('estado').setAttribute("class","text-success");
                $scope.estado = "Guardado.";}, 1000);
            
        };
        
        $scope.citasRevision = function(id)
        {
            alert("citas evaluacion: "+id);
        };
        
    })
    
    .controller("studentController", function($scope, $http, $location, Data){
        $scope.info = Data.info;
        $scope.rowSelected = 0;
        $scope.evaluacionesCurso = [];
        $scope.showEvaluaciones = false;
        $scope.porcentaje = 0;
        $scope.nota = 0;
        $scope.notaProyectada = 0;
        $scope.selectedCita = true;
        $scope.nombreEvaluacion = "";
        $scope.conCita = false;
        $scope.sinCita = false;
        $scope.estadisticas = false;
        $scope.verEvaluaciones = verEvaluaciones;
        $scope.logout = logout;
        $scope.citasRevision = citasRevision;
        $scope.calcularNota = calcularNota;
        $scope.agregarCitaRevision = agregarCitaRevision;
        $scope.selectCita = selectCita;
        
        function selectCita(idCita) {
            $scope.citaSelecionada = idCita;
            $scope.selectedCita = false;
        }

        function calcularNota() {
            $scope.porcentaje = 0;
            $scope.nota = 0;
            $scope.notaProyectada = 0;

            for(var i=0; i<$scope.evaluacionesCurso.length; i++) {
                $scope.porcentaje += parseInt($scope.evaluacionesCurso[i].porcentaje);
                $scope.nota += $scope.evaluacionesCurso[i].nota * ($scope.evaluacionesCurso[i].porcentaje/100);
            }

            $scope.notaProyectada = $scope.nota + (100-$scope.porcentaje);
            $scope.estadisticas = true;
        }
        
        function agregarCitaRevision() {
            $http.get("./BD/insertarCitaRevisionEstudiante.php?idCita="+$scope.citaSelecionada+"&cedula="+Data.info.cedula)
            .success(function(response) {
                
            }); 
        }

        function citasRevision(nombre, idEvaluacion) {
            $scope.conCita = false;
            $scope.sinCita = false;
            $scope.selectedCita = true;
            $scope.nombreEvaluacion = nombre;

            $http.get("./BD/getCitaEvaluacion.php?idEval="+idEvaluacion+"&cedula="+$scope.info.cedula)
            .success(function(response) {
                if(response) {
                    $scope.citaRevision = response;
                    $scope.conCita = true;
                }
                else {
                    $http.get("./BD/citasRevisionEstudiante.php?idEval="+idEvaluacion+"&cedula="+$scope.info.cedula)
                    .success(function(response) {

                        $scope.citas = response;
                        $scope.sinCita = true;
                    }); 
                }
            });
        }
        
        $http.get("./BD/getCursosStudent.php?cedula="+$scope.info.cedula)
            .success(function(response) {
                $scope.MisCursos = response;
            });
        
        function logout() {
            $location.path('/');
        };
        
        function verEvaluaciones(id, nombre)
        {
            $scope.porcentaje = 0;
            $scope.nota = 0;
            $scope.cursoNombre = nombre;
            $scope.idGrupo = id;
            $scope.evaluacionesCurso = [];
            
            $scope.showEvaluaciones = true;
            $scope.estadisticas = false;
            
            $http.get("./BD/getEvaluacionesStudent.php?cedula="+$scope.info.cedula+"&idGrupo="+id)
            .success(function(response) {
                $scope.evaluacionesCurso = response;
                if(response.length > 0)
                    calcularNota(); 
            });
        };
    });
