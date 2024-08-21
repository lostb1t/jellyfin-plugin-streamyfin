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
                Yaml: editor.getModel().getValue()
            };

            //alert(window.editor.getModel().getValue());
                

            window.ApiClient.updatePluginConfiguration(Streamyfin.pluginId, config)
                .then(Dashboard.processPluginConfigurationUpdateResult)
                .catch(function (error) {
                    console.error(error);
                })
                .finally(function () {
                    Dashboard.hideLoadingMsg();
                });
        },
        loadConfig: function () {
            Dashboard.showLoadingMsg();
            window.ApiClient.getPluginConfiguration(Streamyfin.pluginId)
                .then(function (config) {
                    //monaco.value = "hello";
                    //console.log(config);
                    //console.log(config.Yaml);
                    editor.getModel().setValue(config.Yaml);
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