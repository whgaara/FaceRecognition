/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "dbd08ebd9cd4525b241a"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {any} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/Main.ts")(__webpack_require__.s = "./src/Main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Constants.ts":
/*!**************************!*\
  !*** ./src/Constants.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetColor = {
    Normal: '#69f',
    Lighter: '#acf',
    Hot: '#7af',
    Clicked: '#fc9',
    Track: '#ccc',
    TrackHot: '#eee',
    SliderBar: '#36a',
    White: '#fff',
    Black: '#000',
    Red: '#f00',
    Yellow: '#ff0',
    Green: '#0f0',
    PanelTitle: '#37f'
};
exports.FontSize = 12;
exports.Base64Prefix = "data:image/png;base64,";


/***/ }),

/***/ "./src/Main.ts":
/*!*********************!*\
  !*** ./src/Main.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Lan_1 = __webpack_require__(/*! ./lib/Lan */ "./src/lib/Lan.ts");
const UIState_1 = __webpack_require__(/*! ./ui/UIState */ "./src/ui/UIState.ts");
const Panel_1 = __webpack_require__(/*! ./widget/Panel */ "./src/widget/Panel.ts");
const Rect_1 = __webpack_require__(/*! ./math/Rect */ "./src/math/Rect.ts");
const Button_1 = __webpack_require__(/*! ./widget/Button */ "./src/widget/Button.ts");
const NetBucket_1 = __webpack_require__(/*! ./net/NetBucket */ "./src/net/NetBucket.ts");
const ImagePanel_1 = __webpack_require__(/*! ./widget/ImagePanel */ "./src/widget/ImagePanel.ts");
const Constants_1 = __webpack_require__(/*! ./Constants */ "./src/Constants.ts");
const Label_1 = __webpack_require__(/*! ./widget/Label */ "./src/widget/Label.ts");
const Point_1 = __webpack_require__(/*! ./widget/Point */ "./src/widget/Point.ts");
const Vector2_1 = __webpack_require__(/*! ./math/Vector2 */ "./src/math/Vector2.ts");
let state;
const panel1 = new Rect_1.Rect(120, 80, 460, 600);
const imageRect = new Rect_1.Rect(20, 40, 420, 500);
const previewRect = new Rect_1.Rect(20, 560, 90, 25);
const nextRect = new Rect_1.Rect(350, 560, 90, 25);
const labelRect = new Rect_1.Rect(160, 560, 120, 25);
const panel2 = new Rect_1.Rect(640, 80, 460, 460);
const buttonRect = new Rect_1.Rect(60, 30, 120, 25);
const sliderRect = new Rect_1.Rect(20, 100, 220, 20);
const commonPoint = new Rect_1.Rect(20, 40, 200, 25);
const jsyRect = new Rect_1.Rect(20, 75, 90, 25);
const gyzRect = new Rect_1.Rect(130, 75, 90, 25);
const swmRect = new Rect_1.Rect(20, 110, 200, 25);
const rsRect = new Rect_1.Rect(20, 145, 90, 25);
const qgyRect = new Rect_1.Rect(130, 145, 90, 25);
const xsRect = new Rect_1.Rect(20, 180, 90, 25);
const jktyRect = new Rect_1.Rect(130, 180, 90, 25);
const mtRect = new Rect_1.Rect(240, 40, 90, 25);
const byRect = new Rect_1.Rect(350, 40, 90, 25);
const bnzRect = new Rect_1.Rect(240, 75, 90, 25);
const hbbxRect = new Rect_1.Rect(350, 75, 90, 25);
const sjRect = new Rect_1.Rect(240, 110, 200, 25);
const ydRect = new Rect_1.Rect(240, 145, 200, 25);
const bdyRect = new Rect_1.Rect(240, 180, 90, 25);
const sgRect = new Rect_1.Rect(350, 180, 90, 25);
const ssRect = new Rect_1.Rect(240, 215, 200, 25);
const testScoreRect = new Rect_1.Rect(120, 340, 200, 25);
const testRect = new Rect_1.Rect(20, 410, 200, 25);
const returnRect = new Rect_1.Rect(240, 410, 200, 25);
const holder = {
    sliderFactor: 0.0
};
function renderFacePoints(coords, names) {
    for (let i = 0, il = names.length; i < il; ++i) {
        const name = names[i];
        const coordination = coords[name];
        const coord = coordination.split(',');
        const x = parseInt(coord[0]) * state.pixelRatio;
        const y = parseInt(coord[1]) * state.pixelRatio;
        const offset = 2 * state.pixelRatio;
        Point_1.Point(state, new Rect_1.Rect(x - offset, y - offset, 2 * offset, 2 * offset));
        const length = name.length * 17 * state.pixelRatio;
        state.render.renderText(new Rect_1.Rect(x, y, length, 18 * state.pixelRatio), name, Constants_1.WidgetColor.Red);
    }
}
const inputPosition = new Vector2_1.Vector2();
function calculateScore(inputs, nameList) {
    if (inputs.length < nameList.length) {
        return 100;
    }
    let score = 0.0;
    const face = window.data.data[faceIndex];
    for (let i = 0, il = nameList.length; i < il; ++i) {
        let mint = Infinity;
        inputPosition.copy(inputs[i].origin).sub(imageRect.origin).sub(panel1.origin);
        for (let j = 0, jl = nameList.length; j < jl; ++j) {
            const coordination = face[nameList[j]];
            const coords = coordination.split(',');
            const x = parseInt(coords[0]);
            const y = parseInt(coords[1]);
            const distance = inputPosition.clone().sub(new Vector2_1.Vector2(x, y)).len();
            if (distance < mint) {
                mint = distance;
            }
        }
        score += mint;
    }
    return score;
}
let input_image_source;
const img_url = 'http://0.0.0.0/img/';
const operate_url = 'http://0.0.0.0/operate/';
function Start() {
    state = UIState_1.UIState.Instance();
    const canvas = Lan_1.DOM('view');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    state.setCanvas(canvas);
    NetBucket_1.NetBucket.request(img_url).then((resource) => {
        const data = JSON.parse(resource);
        window.data = data;
        faceCount = data.data.length;
        for (let i = 0, il = data.data.length; i < il; ++i) {
            let pack = data.data[i];
            const image = new Image();
            image.src = Constants_1.Base64Prefix + pack.data;
            data.data[i].data = image;
        }
    });
    const img_input = Lan_1.DOM('img');
    img_input.onchange = function (data) {
        const reader = new FileReader();
        const file = data.srcElement.files[0];
        reader.onload = function (event) {
            input_image_source = this.result;
            input_image_source = input_image_source.replace(/^data:image\/(.+);base64\,/, '');
            const formData = new FormData();
            formData.set('img', input_image_source);
            const request = new Request(operate_url, {
                method: 'POST',
                body: formData
            });
            fetch(request).then(function (response) {
                response.json().then(function (json) {
                    console.log(json);
                    const input_data = json.data[0];
                    const image = new Image();
                    image.src = Constants_1.Base64Prefix + input_data.data;
                    input_data.data = image;
                    const data = window.data.data;
                    data.push(input_data);
                    ++faceCount;
                    imagePage = faceIndex + 1 + ' / ' + faceCount;
                });
            });
        };
        reader.readAsDataURL(file);
    };
}
let faceIndex = 0;
let faceCount = 12;
let imagePage = '1 / ' + faceCount;
let testing = false;
let testResult = false;
let testDrawList = [];
let testResultLines = [];
let testCorrectPoints = [];
let testInputPoints = [];
let testScoreText = '';
const pointRect = new Rect_1.Rect();
const coordMap = {
    '常用穴位': ['上明', '上迎香', '丝竹空', '健明', '印堂', '地仓', '承泣', '攒竹', '球后', '睛明', '迎香', '阳白'],
    '中心性视网膜炎': ['承泣'],
    '干眼症': ['睛明', '健明'],
    '弱视': ['睛明', '球后', '上明'],
    '散光': ['睛明', '球后'],
    '斜视': ['球后', '健明'],
    '甲亢凸眼': ['睛明', '上明'],
    '白内障': ['睛明', '上明', '健明'],
    '眼袋': ['健明', '球后', '承泣'],
    '视神经萎缩': ['球后', '承泣'],
    '视网膜色素变性': ['球后', '健明'],
    '近视眼': ['睛明', '承泣', '球后'],
    '青光眼': ['攒竹', '睛明'],
    '面瘫': ['攒竹', '迎香', '阳白', '丝竹空', '地仓'],
    '黄斑变性': ['睛明', '承泣', '球后'],
    '鼻炎': ['迎香', '印堂', '上迎香'],
    '鼻窦炎': ['印堂', '迎香']
};
let drawList = [];
function Update() {
    requestAnimationFrame(Update);
    state.render.clear();
    Panel_1.Panel(1, '人脸图像', state, panel1, function () {
        const data = window.data;
        if (data) {
            if (ImagePanel_1.ImagePanel(11, state, imageRect, data.data[faceIndex], function () {
                // sub actions
                const data = window.data;
                if (data && data.data) {
                    const face = data.data[faceIndex];
                    renderFacePoints(face, drawList);
                }
            }) && testing) {
                // passed sub process
                const origin = state.mousePosition.clone();
                if (imageRect.contain(origin) && testInputPoints.length < testDrawList.length) {
                    testInputPoints.push(new Rect_1.Rect(origin.x - 2 * state.pixelRatio, origin.y - 2 * state.pixelRatio, 4 * state.pixelRatio, 4 * state.pixelRatio));
                }
            }
        }
        if (Button_1.Button(12, '上一张', state, previewRect)) {
            faceIndex = (faceIndex - 1) % faceCount;
            if (faceIndex < 0) {
                faceIndex = 11;
            }
            imagePage = (faceIndex + 1) + ' / ' + faceCount;
        }
        if (Button_1.Button(13, '下一张', state, nextRect)) {
            faceIndex = (faceIndex + 1) % faceCount;
            imagePage = (faceIndex + 1) + ' / ' + faceCount;
        }
        Label_1.Label(14, imagePage, state, labelRect);
    });
    Panel_1.Panel(5, '控制台', state, panel2, function () {
        if (Button_1.Button(51, '常用穴位', state, commonPoint)) {
            drawList = coordMap['常用穴位'];
            testInputPoints = [];
        }
        if (Button_1.Button(52, '近视眼', state, jsyRect)) {
            drawList = coordMap['近视眼'];
            testInputPoints = [];
        }
        if (Button_1.Button(53, '干眼症', state, gyzRect)) {
            drawList = coordMap['干眼症'];
            testInputPoints = [];
        }
        if (Button_1.Button(54, '中心性视网膜炎', state, swmRect)) {
            drawList = coordMap['中心性视网膜炎'];
            testInputPoints = [];
        }
        if (Button_1.Button(55, '弱视', state, rsRect)) {
            drawList = coordMap['弱视'];
            testInputPoints = [];
        }
        if (Button_1.Button(56, '青光眼', state, qgyRect)) {
            drawList = coordMap['青光眼'];
            testInputPoints = [];
        }
        if (Button_1.Button(57, '斜视', state, xsRect)) {
            drawList = coordMap['斜视'];
            testInputPoints = [];
        }
        if (Button_1.Button(58, '甲亢凸眼', state, jktyRect)) {
            drawList = coordMap['甲亢凸眼'];
            testInputPoints = [];
        }
        if (Button_1.Button(60, '面瘫', state, mtRect)) {
            drawList = coordMap['面瘫'];
            testInputPoints = [];
        }
        if (Button_1.Button(61, '鼻炎', state, byRect)) {
            drawList = coordMap['鼻炎'];
            testInputPoints = [];
        }
        if (Button_1.Button(62, '白内障', state, bnzRect)) {
            drawList = coordMap['白内障'];
            testInputPoints = [];
        }
        if (Button_1.Button(63, '黄斑变性', state, hbbxRect)) {
            drawList = coordMap['黄斑变性'];
            testInputPoints = [];
        }
        if (Button_1.Button(64, '视神经萎缩', state, sjRect)) {
            drawList = coordMap['视神经萎缩'];
            testInputPoints = [];
        }
        if (Button_1.Button(65, '眼袋', state, ydRect)) {
            drawList = coordMap['眼袋'];
            testInputPoints = [];
        }
        if (Button_1.Button(66, '鼻窦炎', state, bdyRect)) {
            drawList = coordMap['鼻窦炎'];
            testInputPoints = [];
        }
        if (Button_1.Button(67, '散光', state, sgRect)) {
            drawList = coordMap['散光'];
            testInputPoints = [];
        }
        if (Button_1.Button(68, '视网膜色素变性', state, ssRect)) {
            drawList = coordMap['视网膜色素变性'];
            testInputPoints = [];
        }
        if (Button_1.Button(70, !testing ? '开始测试' : '查看分数', state, testRect)) {
            if (testing) {
                let score = calculateScore(testInputPoints, testDrawList);
                console.log(score);
                if (score > 200)
                    score = 100 * 2;
                testScoreText = '测试得分: ' + (100 - score / 2).toFixed(2);
                testResult = true;
                drawList = testDrawList;
            }
            else {
                testScoreText = '';
                testDrawList = drawList;
                drawList = [];
                testInputPoints = [];
                testResult = false;
            }
            testing = !testing;
        }
        if (Button_1.Button(71, '返回', state, returnRect)) { }
        Label_1.Label(72, testScoreText, state, testScoreRect);
    });
    for (let i = 0, il = testInputPoints.length; i < il; ++i) {
        pointRect.copy(testInputPoints[i]);
        Point_1.Point(state, pointRect);
    }
}
function Main() {
    Start();
    Update();
}
Main();


/***/ }),

/***/ "./src/lib/Lan.ts":
/*!************************!*\
  !*** ./src/lib/Lan.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function DOM(id) {
    return document.getElementById(id);
}
exports.DOM = DOM;
exports.log = console.log;
function byteLength(content) {
    let len = 0;
    for (let i = 0; i < content.length; i++) {
        if ((content.charCodeAt(i) & 0xff00) != 0)
            len++;
        len++;
    }
    return len;
}
exports.byteLength = byteLength;
;


/***/ }),

/***/ "./src/math/Rect.ts":
/*!**************************!*\
  !*** ./src/math/Rect.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector2_1 = __webpack_require__(/*! ./Vector2 */ "./src/math/Vector2.ts");
const tmp = new Vector2_1.Vector2();
class Rect {
    constructor(x, y, w, h) {
        x = x !== undefined ? x : 0;
        y = y !== undefined ? y : 0;
        w = w !== undefined ? w : 0;
        h = h !== undefined ? h : 0;
        this.origin = new Vector2_1.Vector2(x, y);
        this.size = new Vector2_1.Vector2(w, h);
    }
    width() {
        return this.size.x;
    }
    height() {
        return this.size.y;
    }
    translate(x, y) {
        this.origin.x += x;
        this.origin.y += y;
        return this;
    }
    scale(x, y) {
        this.size.x *= x;
        this.size.y *= y;
        return this;
    }
    contain(p) {
        tmp.copy(this.origin).add(this.size);
        return p.greatThan(this.origin) && p.lessThan(this.origin.clone().add(this.size));
    }
    clone() {
        return new Rect(this.origin.x, this.origin.y, this.size.x, this.size.y);
    }
    copy(rect) {
        this.origin.copy(rect.origin);
        this.size.copy(rect.size);
        return this;
    }
    elements() {
        return [this.origin.x, this.origin.y, this.size.x, this.size.y];
    }
}
exports.Rect = Rect;


/***/ }),

/***/ "./src/math/Vector2.ts":
/*!*****************************!*\
  !*** ./src/math/Vector2.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.x = x !== undefined ? x : 0;
        this.y = y !== undefined ? y : 0;
    }
    min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
    }
    max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    addScalar(s) {
        this.x += s;
        this.y += s;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    mag() {
        return this.x * this.x + this.y * this.y;
    }
    len() {
        return Math.sqrt(this.mag());
    }
    normalize() {
        return this.mult(1.0 / this.len());
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    minElement() {
        return Math.min(this.x, this.y);
    }
    maxElement() {
        return Math.max(this.x, this.y);
    }
    elements() {
        return new Float32Array([this.x, this.y]);
    }
    lessThan(v) {
        return this.x < v.x && this.y < v.y;
    }
    greatThan(v) {
        return this.x > v.x && this.y > v.y;
    }
}
exports.Vector2 = Vector2;


/***/ }),

/***/ "./src/net/NetBucket.ts":
/*!******************************!*\
  !*** ./src/net/NetBucket.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class NetBucket {
    static async request(key) {
        const url = key;
        let resource = NetBucket.bucket.get(url);
        if (resource !== undefined) {
            return resource;
        }
        resource = await NetBucket.download(url);
        NetBucket.bucket.set(url, resource);
        return resource;
    }
    static async download(url) {
        const response = await fetch(url);
        return response.text();
    }
}
NetBucket.bucket = new Map();
exports.NetBucket = NetBucket;


/***/ }),

/***/ "./src/ui/Mouse.ts":
/*!*************************!*\
  !*** ./src/ui/Mouse.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["None"] = -1] = "None";
    MouseButton[MouseButton["Left"] = 0] = "Left";
    MouseButton[MouseButton["Middle"] = 1] = "Middle";
    MouseButton[MouseButton["Right"] = 2] = "Right";
})(MouseButton = exports.MouseButton || (exports.MouseButton = {}));
;


/***/ }),

/***/ "./src/ui/Render.ts":
/*!**************************!*\
  !*** ./src/ui/Render.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __webpack_require__(/*! ../Constants */ "./src/Constants.ts");
class Render {
    constructor(state) {
        this.state = state;
        this.context = state.context;
    }
    setPixelRatio(pixelRatio) {
        pixelRatio = pixelRatio;
    }
    clear() {
        this.state.canvas.height = this.state.canvas.height;
    }
    renderLine(start, end, color) {
        this.context.fillStyle = color;
        this.context.moveTo(start.x, start.y);
        this.context.lineTo(end.x, end.y);
    }
    renderRect(rect, color) {
        const x = (rect.origin.x + this.state.origin.x) * this.state.pixelRatio;
        const y = (rect.origin.y + this.state.origin.y) * this.state.pixelRatio;
        const w = rect.size.x * this.state.pixelRatio;
        const h = rect.size.y * this.state.pixelRatio;
        this.context.fillStyle = color;
        this.context.fillRect(x, y, w, h);
    }
    renderText(rect, content, color) {
        const x = (this.state.origin.x + rect.origin.x + rect.size.x / 2) * this.state.pixelRatio;
        const y = (this.state.origin.y + rect.origin.y + rect.size.y / 2 + Constants_1.FontSize / 4) * this.state.pixelRatio;
        this.context.textAlign = 'center';
        this.context.textBaseLine = 'middle';
        this.context.font = ((Constants_1.FontSize * this.state.pixelRatio) | 0) + 'px Arial';
        this.context.fillStyle = color ? color : '#000';
        this.context.fillText(content, x, y);
    }
    renderImage(rect, source) {
        const x = (rect.origin.x + this.state.origin.x) * this.state.pixelRatio;
        const y = (rect.origin.y + this.state.origin.y) * this.state.pixelRatio;
        const w = rect.size.x * this.state.pixelRatio;
        const h = rect.size.y * this.state.pixelRatio;
        this.context.drawImage(source, x, y, w, h);
    }
}
exports.Render = Render;


/***/ }),

/***/ "./src/ui/UIState.ts":
/*!***************************!*\
  !*** ./src/ui/UIState.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector2_1 = __webpack_require__(/*! ../math/Vector2 */ "./src/math/Vector2.ts");
const Mouse_1 = __webpack_require__(/*! ./Mouse */ "./src/ui/Mouse.ts");
const Render_1 = __webpack_require__(/*! ./Render */ "./src/ui/Render.ts");
class UIState {
    constructor() {
        this.mouseStart = new Vector2_1.Vector2();
        this.mouseEnd = new Vector2_1.Vector2();
        this.origin = new Vector2_1.Vector2();
        this.mousePosition = new Vector2_1.Vector2();
        this.mouseTranslate = new Vector2_1.Vector2();
        this.mouseMovement = new Vector2_1.Vector2();
        this.mouseButton = Mouse_1.MouseButton.None;
        this.hotId = -1;
        this.activeId = -1;
    }
    static Instance() {
        if (UIState.instance === undefined) {
            UIState.instance = new UIState();
        }
        return UIState.instance;
    }
    setCanvas(canvas) {
        this.canvas = canvas;
        // this.pixelRatio = window.devicePixelRatio;
        this.pixelRatio = 1.0; // test case
        const width = canvas.width;
        const height = canvas.height;
        this.canvas.width = this.width = width * this.pixelRatio;
        this.canvas.height = this.width = height * this.pixelRatio;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.context = this.canvas.getContext('2d');
        this.render = new Render_1.Render(this);
        canvas.addEventListener('mousemove', (event) => {
            this.mousePosition.set(Math.max(0, event.clientX), Math.max(0, event.clientY));
            this.mouseMovement.set(event.movementX, event.movementY);
            this.mouseTranslate = this.mouseStart.clone().sub(this.mousePosition);
        }, false);
        canvas.addEventListener('mousedown', (event) => {
            this.mouseButton = event.button;
            this.mouseStart.set(event.clientX, event.clientY);
        }, false);
        canvas.addEventListener('mouseup', (event) => {
            this.mouseButton = Mouse_1.MouseButton.None;
            this.mouseTranslate.set(0, 0);
            this.activeId = -1;
        }, false);
        return this;
    }
}
exports.UIState = UIState;


/***/ }),

/***/ "./src/widget/Button.ts":
/*!******************************!*\
  !*** ./src/widget/Button.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __webpack_require__(/*! ../Constants */ "./src/Constants.ts");
const Mouse_1 = __webpack_require__(/*! ../ui/Mouse */ "./src/ui/Mouse.ts");
function Button(id, text, state, rect) {
    let stateColor = Constants_1.WidgetColor.Normal;
    let pass = false;
    // update state
    if (rect.contain(state.mousePosition.clone().sub(state.origin))) {
        if (state.mouseButton !== Mouse_1.MouseButton.None) { // click
            stateColor = Constants_1.WidgetColor.Clicked;
            if (state.activeId !== id) {
                pass = true;
                state.activeId = id;
            }
        }
        else { // hover
            stateColor = Constants_1.WidgetColor.Hot;
            if (state.hotId !== id) {
                state.hotId = id;
            }
        }
    }
    if (state.activeId === id) {
        // active actions
    }
    // render widget
    const render = state.render;
    render.renderRect(rect, stateColor);
    render.renderText(rect, text, Constants_1.WidgetColor.White);
    return pass;
}
exports.Button = Button;


/***/ }),

/***/ "./src/widget/ImagePanel.ts":
/*!**********************************!*\
  !*** ./src/widget/ImagePanel.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __webpack_require__(/*! ../Constants */ "./src/Constants.ts");
const Mouse_1 = __webpack_require__(/*! ../ui/Mouse */ "./src/ui/Mouse.ts");
const imageHolder = new Image();
function ImagePanel(id, state, rect, source, subActions) {
    let stateColor = Constants_1.WidgetColor.Normal;
    let pass = false;
    // update state
    if (rect.contain(state.mousePosition.clone().sub(state.origin))) {
        if (state.mouseButton !== Mouse_1.MouseButton.None) { // click
            stateColor = Constants_1.WidgetColor.Clicked;
            if (state.activeId !== id) {
                pass = true;
                state.activeId = id;
            }
        }
        else { // hover
            stateColor = Constants_1.WidgetColor.Hot;
            if (state.hotId !== id) {
                state.hotId = id;
            }
        }
    }
    if (state.activeId === id) {
        // active actions
    }
    const render = state.render;
    if (source && source.data) {
        render.renderImage(rect, source.data);
    }
    let prevOrigin = state.origin.clone();
    state.origin.add(rect.origin);
    if (subActions !== undefined) {
        subActions();
    }
    state.origin.copy(prevOrigin);
    return pass;
}
exports.ImagePanel = ImagePanel;


/***/ }),

/***/ "./src/widget/Label.ts":
/*!*****************************!*\
  !*** ./src/widget/Label.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __webpack_require__(/*! ../Constants */ "./src/Constants.ts");
function Label(id, text, state, rect) {
    const render = state.render;
    render.renderText(rect, text, Constants_1.WidgetColor.White);
}
exports.Label = Label;


/***/ }),

/***/ "./src/widget/Panel.ts":
/*!*****************************!*\
  !*** ./src/widget/Panel.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Rect_1 = __webpack_require__(/*! ../math/Rect */ "./src/math/Rect.ts");
const Mouse_1 = __webpack_require__(/*! ../ui/Mouse */ "./src/ui/Mouse.ts");
const Constants_1 = __webpack_require__(/*! ../Constants */ "./src/Constants.ts");
const Vector2_1 = __webpack_require__(/*! ../math/Vector2 */ "./src/math/Vector2.ts");
const panelTitleRect = new Rect_1.Rect(0, 0, 0, 0);
const TitleHeight = 20;
const TitleOffset = new Vector2_1.Vector2(0, 0);
function Panel(id, title, state, rect, subActions) {
    let stateColor = Constants_1.WidgetColor.Lighter;
    let titleColor = Constants_1.WidgetColor.PanelTitle;
    let pass = true;
    const render = state.render;
    panelTitleRect.copy(rect);
    panelTitleRect.size.y = TitleHeight;
    // update state
    if (panelTitleRect.contain(state.mousePosition)) {
        if (state.mouseButton !== Mouse_1.MouseButton.None) {
            titleColor = Constants_1.WidgetColor.Clicked;
            state.activeId = id;
        }
        else {
            titleColor = Constants_1.WidgetColor.Hot;
        }
    }
    if (state.activeId === id) {
        titleColor = Constants_1.WidgetColor.Clicked;
        if (state.mouseMovement.len() > 1)
            rect.origin.add(state.mouseMovement);
        panelTitleRect.origin.copy(rect.origin);
    }
    // render widget
    render.renderRect(rect, stateColor);
    render.renderRect(panelTitleRect, titleColor);
    render.renderText(panelTitleRect, title, Constants_1.WidgetColor.White);
    let prevOrigin = state.origin.clone();
    state.origin.copy(rect.origin);
    if (subActions !== undefined) {
        subActions();
    }
    state.origin.copy(prevOrigin);
    return pass;
}
exports.Panel = Panel;


/***/ }),

/***/ "./src/widget/Point.ts":
/*!*****************************!*\
  !*** ./src/widget/Point.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __webpack_require__(/*! ../Constants */ "./src/Constants.ts");
function Point(state, rect) {
    const render = state.render;
    render.renderRect(rect, Constants_1.WidgetColor.Red);
}
exports.Point = Point;


/***/ })

/******/ });
//# sourceMappingURL=main.bundle.js.map