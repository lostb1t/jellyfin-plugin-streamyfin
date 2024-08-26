import * as monaco from 'monaco-editor';
import { configureMonacoYaml } from 'monaco-yaml';

// console.log(import.meta.url);
window.MonacoEnvironment = {
	getWorker(moduleId, label) {
		switch (label) {
			case 'editorWorkerService':
				return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url))
			case 'yaml':
				return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url))
			default:
				throw new Error(`Unknown label ${label}`)
		}
	}
}
// const editor = monaco.editor.create(document.getElementById('yamleditor'), {
// 	// value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
// 	language: 'yaml'
// });
const yamlModelUri = monaco.Uri.parse('a://b/foo.yaml');

const monacoYaml = configureMonacoYaml(monaco, {
	enableSchemaRequest: true,
	hover: true,
	completion: true,
	validate: true,
	format: true,
	schemas: [
		{
			uri: '/streamyfin/config.yaml',
			fileMatch: ["*"],
		},
	],
});

monaco.editor.setTheme('vs-dark');
const editor = monaco.editor.create(document.getElementById('yamleditor'), {
	automaticLayout: true,
	language: 'yaml',
	quickSuggestions: {
		other: true,
		comments: false,
		strings: true
	},
	model: monaco.editor.createModel('', 'yaml', yamlModelUri),
});

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