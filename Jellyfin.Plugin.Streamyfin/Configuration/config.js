import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.39.0/+esm';


// var script = document.querySelector('#mnjs');
// script.addEventListener('load', function () {
   // alert("hoi");
    // alert(monaco);


monaco.editor.setTheme('vs-dark');
const editor = monaco.editor.create(document.getElementById('yamleditor'), {
      		language: 'yaml'
});


if (typeof Streamyfin == 'undefined') {
    const Streamyfin = {
        pluginId: "1e9e5d38-6e67-4615-8719-e98a5c34f004",
        //configurationWrapper: document.querySelector("#configurationWrapper"),
        //editor: null,
        btnSave: document.querySelector("#saveConfig"),

        saveConfig: function (e) {
            e.preventDefault();
            Dashboard.showLoadingMsg();
            const config = {
                Value: editor.getModel().getValue()
            };

            //alert(window.editor.getModel().getValue());
            const url = window.ApiClient.getUrl('streamyfin/config/yaml');
            const data = JSON.stringify(config);
            console.log(data);
            //window.ApiClient.getPluginConfiguration(Streamyfin.pluginId)
            window.ApiClient.ajax({ type: 'POST', url, data, contentType: 'application/json'})
                .then(function(response) {
                  response.json().then(res => {
                    if (res.Error == true) {
                      Dashboard.hideLoadingMsg();
                      Dashboard.alert(res.Message);
                      //response.statusText = res.Message;
                      //Dashboard.processErrorResponse(response);
                    } else {
                        Dashboard.processPluginConfigurationUpdateResult();
                    }
                  })
                }
                  //processErrorResponse

                )
                .catch(function (error) {
                   //alert(error);
                    console.error(error);
                })
                .finally(function () {
                    Dashboard.hideLoadingMsg();
                });
                
        },
        loadConfig: function () {
            Dashboard.showLoadingMsg();
            const url = window.ApiClient.getUrl('streamyfin/config/yaml');
            //window.ApiClient.getPluginConfiguration(Streamyfin.pluginId)
            window.ApiClient.ajax({ type: 'GET', url, contentType: 'application/json'})
                .then(function (response) {
                  response.json().then(res => {
                    //monaco.value = "hello";
                    //console.log(config);
                    //console.log(config.Yaml);
                    //const data = JSON.stringify({ Username: username, Password: password });
                    //const yaml = window.ApiClient.getUrl('streamyfin/config/yaml');
                    editor.getModel().setValue(res.Value);
                  })
                    //console.log(config);
                    //for (let i = 0; i < config.ImportSets.length; i++) {
                    //    CollectionImport.addSet(config.ImportSets[i]);
                    // }
                })
                .catch(function (error) {
                    console.error(error);
                })
                .finally(function () {
                    Dashboard.hideLoadingMsg();
                });
        },
        init: function () {
            //alert("yo");
            console.log("init");
            Streamyfin.loadConfig();
            Streamyfin.btnSave.addEventListener("click", Streamyfin.saveConfig);
        }
    }
    Streamyfin.init();
}
// });
        // view.addEventListener("viewshow", function (e) {
        //document.querySelector('#StreamyfinConfigPage').addEventListener("pageshow", function () {
            
        //    Streamyfin.init();
       // });