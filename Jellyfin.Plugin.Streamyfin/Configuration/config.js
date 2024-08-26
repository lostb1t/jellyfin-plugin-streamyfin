// if (typeof isElementLoaded == 'undefined') {
const isElementLoaded = async selector => {
    while (document.querySelector(selector) === null) {
        await new Promise(resolve => requestAnimationFrame(resolve))
    }
    return document.querySelector(selector);
};

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// isElementLoaded('#mnjs').then((selector) => {
// alert("hello");
// });
// }
import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.51.0/+esm';
// import monacoYamlPrebuilt from 'https://cdn.jsdelivr.net/npm/monaco-yaml-prebuilt@1.0.0/+esm';

// waitForElm('#mnjs').then((selector) => {
    // setTimeout(1000)
    // console.log("First")
    // setTimeout(1000)
    // console.log("Second")
    // setTimeout(10000)
    // console.log("Third")
    // if (typeof monaco !== 'undefined') {
    //     alert("yo");
    //     console.log(monaco);
    
    // const yamlModelUri = monaco.Uri.parse('/streamyfin/config/yaml');
    const yamlModelUri = monaco.Uri.parse('a://b/foo.yaml');

    // monacoYamlPrebuilt.configureMonacoYaml(monaco, {
    //     enableSchemaRequest: true,
    //     hover: true,
    //     completion: true,
    //     validate: true,
    //     format: true,
    //     schemas: [
    //         {
    //             uri: '/streamyfin/config/schema',
    //             fileMatch: ["*"],
    //         },
    //     ],
    // });

    // import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.39.0/+esm';


    // monaco.editor.setTheme('vs-dark');
    // const editor = monaco.editor.create(document.getElementById('yamleditor'), {
    //       		language: 'yaml'
    // });

    monaco.editor.setTheme('vs-dark');
    const editor = monaco.editor.create(document.getElementById('yamleditor'), {
        automaticLayout: true,
        language: 'yaml',
        model: monaco.editor.createModel('', 'yaml', yamlModelUri),
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
                            console.log(res);
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
// } 
// });