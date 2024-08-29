function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

//sleep(5000).then(async () => {
//var script = document.querySelector('#hljs');
//  script.addEventListener('load', function() {
if (typeof Streamyfin === 'undefined') {

    const Streamyfin = {
        pluginId: "1e9e5d38-6e67-4615-8719-e98a5c34f004",
        btnSave: document.querySelector("#saveConfig"),
        editor: null,
        saveConfig: function (e) {
            e.preventDefault();
            Dashboard.showLoadingMsg();
            const config = {
                Value: editor.getModel().getValue()
            };

            //alert(window.editor.getModel().getValue());
            const url = window.ApiClient.getUrl('streamyfin/config/yaml');
            const data = JSON.stringify(config);
            //console.log(data);
            //window.ApiClient.getPluginConfiguration(Streamyfin.pluginId)
            window.ApiClient.ajax({ type: 'POST', url, data, contentType: 'application/json' })
                .then(function (response) {
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
            window.ApiClient.ajax({ type: 'GET', url, contentType: 'application/json' })
                .then(function (response) {
                    response.json().then(res => {
                        //monaco.value = "hello";
                        //console.log(res);
                        //console.log(config.Yaml);
                        //const data = JSON.stringify({ Username: username, Password: password });
                        //const yaml = window.ApiClient.getUrl('streamyfin/config/yaml');
                        //editor.getModel().setValue(res.Value);
                        Streamyfin.editor = monaco.editor.create(document.getElementById('yamleditor'), {
                            automaticLayout: true,
                            language: 'yaml',
                            quickSuggestions: {
                                other: true,
                                comments: false,
                                strings: true
                            },
                            model: monaco.editor.createModel(res.Value, 'yaml', yamlModelUri),
                        });
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
              const yamlModelUri = monaco.Uri.parse('streamyfin.yaml');
    monaco.editor.setTheme('vs-dark');


    const monaco_yaml = monacoYaml.configureMonacoYaml(monaco, {
        enableSchemaRequest: true,
        hover: true,
        completion: true,
        validate: true,
        format: true,
        schemas: [
            {
                uri: location.origin + '/streamyfin/config/schema',
                fileMatch: ["*"],
            },
        ],
    });
            //alert("yo");
            console.log("init");
            Streamyfin.loadConfig();
            Streamyfin.btnSave.addEventListener("click", Streamyfin.saveConfig);
        }
    }
   // Streamyfin.init();
    //});
}