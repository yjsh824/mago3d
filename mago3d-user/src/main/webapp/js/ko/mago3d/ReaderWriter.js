'use strict';

/**
 * 어떤 일을 하고 있습니까?
 * @class ReaderWriter
 */
var ReaderWriter = function() {
	if(!(this instanceof ReaderWriter)) {
		throw new Error(Messages.CONSTRUCT_ERROR);
	}

	//this.geometryDataPath = "/F4D_GeometryData";
	this.geometryDataPath = MagoConfig.getPolicy().geo_data_path;
	this.viArraysContainer = new VertexIdxVBOArraysContainer();
	this.byteColorsVBOArraysContainer = new ByteColorsVBOArraysContainer();
	//var simpleBuildingImage = new Image();

	this.j_counter;
	this.k_counter;

	this.gl;
	this.incre_latAng = 0.001;
	this.incre_longAng = 0.001;
	this.GAIA3D__offset_latitude = -0.001;
	this.GAIA3D__offset_longitude = -0.001;
	this.GAIA3D__counter = 0;

	// Var for reading files.***Var for reading files.***Var for reading files.***Var for reading files.***Var for reading files.***
	// Var for reading files.***Var for reading files.***Var for reading files.***Var for reading files.***Var for reading files.***
	this.uint32;
	this.uint16;
	this.int16;
	this.float32;
	this.float16;
	this.int8;
	this.int8_value;
	this.max_color_value = 126;

	this.startBuff;
	this.endBuff;

	this.filesReadings_count = 0;

	// SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.*** SCRATCH.***
	this.temp_var_to_waste;
	this.countSC;
	this.xSC;
	this.ySC;
	this.zSC;
	this.point3dSC = new Point3D();
	this.bboxSC = new BoundingBox();
};

/**
 * 버퍼에서 데이터를 읽어서 32비트 부호없는 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns uint32[0]
 */
ReaderWriter.prototype.readUInt32 = function(buffer, start, end) {
	var uint32 = new Uint32Array(buffer.slice(start, end));
	return uint32[0];
};

/**
 * 버퍼에서 데이터를 읽어서 32비트 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns int32[0]
 */
ReaderWriter.prototype.readInt32 = function(buffer, start, end) {
	var int32 = new Int32Array(buffer.slice(start, end));
	return int32[0];
};

/**
 * 버퍼에서 데이터를 읽어서 16비트 부호없는 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns uint16[0]
 */
ReaderWriter.prototype.readUInt16 = function(buffer, start, end) {
	var uint16 = new Uint16Array(buffer.slice(start, end));
	return uint16[0];
};

/**
 * 버퍼에서 데이터를 읽어서 32비트 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns int16[0]
 */
ReaderWriter.prototype.readInt16 = function(buffer, start, end) {
	var int16 = new Int16Array(buffer.slice(start, end));
	return int16[0];
};

/**
 * 버퍼에서 데이터를 읽어서 64비트 float값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns float64[0]
 */
ReaderWriter.prototype.readFloat64 = function(buffer, start, end) {
	var float64 = new Float64Array(buffer.slice(start, end));
	return float64[0];
};

/**
 * 버퍼에서 데이터를 읽어서 32비트 float값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns float32[0]
 */
ReaderWriter.prototype.readFloat32 = function(buffer, start, end) {
	var float32 = new Float32Array(buffer.slice(start, end));
	return float32[0];
};

/**
 * 버퍼에서 데이터를 읽어서 32비트 부호없는 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns float16[0]
 */
ReaderWriter.prototype.readFloat16 = function(buffer, start, end) {
	var float16 = new Float32Array(buffer.slice(start, end));
	return float16[0];
};

/**
 * 버퍼에서 데이터를 읽어서 8비트 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns int8[0]
 */
ReaderWriter.prototype.readInt8 = function(buffer, start, end) {
	var int8 = new Int8Array(buffer.slice(start, end));
	return int8[0];
};

/**
 * 버퍼에서 데이터를 읽어서 8비트 부호없는 정수값에 대한 배열의 0번째 값을 돌려줌
 * @param buffer 복사할 버퍼
 * @param start 시작 바이트 인덱스
 * @param end 끝 바이트 인덱스
 * @returns uint8[0]
 */
ReaderWriter.prototype.readUInt8 = function(buffer, start, end) {
	var uint8 = new Uint8Array(buffer.slice(start, end));
	return uint8[0];
};

/**
 * 어떤 일을 하고 있습니까?
 * @param buffer 변수
 * @param start 변수
 * @param end 변수
 * @returns int8_value
 */
ReaderWriter.prototype.readInt8ByteColor = function(buffer, start, end) {
	var int8 = new Int8Array(buffer.slice(start, end));
	var int8_value = int8[0];

	if(int8_value > max_color_value) int8_value = max_color_value;

	if(int8_value < 0) int8_value += 256;

	return int8_value;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param float32Array 변수
 * @param resultBbox 변수
 * @returns resultBbox
 */
ReaderWriter.prototype.getBoundingBoxFromFloat32Array = function(float32Array, resultBbox) {
	if(resultBbox == undefined) resultBbox = new BoundingBox();

	var values_count = float32Array.length;
	for(var i=0; i<values_count; i+=3) {
		this.point3dSC.x = float32Array[i];
		this.point3dSC.y = float32Array[i+1];
		this.point3dSC.z = float32Array[i+2];

		if(i==0) {
			resultBbox.setInit(this.point3dSC);
		} else {
			resultBbox.addPoint3D(this.point3dSC);
		}
	}

	return resultBbox;
};

ReaderWriter.prototype.getNeoBlocksArraybuffer = function(fileName, blocksList, magoManager) {
	magoManager.fileRequestControler.filesRequestedCount += 1;
	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;
	
	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			blocksList.dataArraybuffer = arrayBuffer;
			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		} else {
			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("Invalid XMLHttpRequest status = " + status);
		if(status == 0) blocksList.fileLoadState = 500;
		else blocksList.fileLoadState = status;
	}).always(function() {
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

function loadWithXhr(fileName) {
	// 1) 사용될 jQuery Deferred 객체를 생성한다.
	var deferred = $.Deferred();
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", fileName, true)
	xhr.responseType = "arraybuffer";;
	  
	// 이벤트 핸들러를 등록한다.
	xhr.onload = function() {
		if (xhr.status < 200 || xhr.status >= 300) {
			deferred.reject(xhr.status);
			return;
		} else {
			// 3.1) DEFERRED를 해결한다. (모든 done()...을 동작시킬 것이다.)
			deferred.resolve(xhr.response);
		} 
	};
	
	xhr.onerror = function(e) {
		console.log("Invalid XMLHttpRequest response type.");
        deferred.reject(xhr.status);
    };

	// 작업을 수행한다.
	xhr.send(null);
	
	// 참고: jQuery.ajax를 사용할 수 있었고 해야할 수 있었다.
	// 참고: jQuery.ajax는 Promise를 반환하지만 다른 Deferred/Promise를 사용하여 애플리케이션에 의미있는 구문으로 감싸는 것은 언제나 좋은 생각이다.
	// ---- /AJAX 호출 ---- //
	  
	// 2) 이 deferred의 promise를 반환한다.
	return deferred.promise();
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param blocksList 변수
 * @param neoBuilding 변수
 * @param readerWriter 변수
 */
ReaderWriter.prototype.getNeoBlocks = function(gl, fileName, blocksList, readerWriter, magoManager) {
//	magoManager.fileRequestControler.neoBuildingBlocksListsRequestedCount += 1;
	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			readerWriter.readNeoBlocks(gl, arrayBuffer, blocksList);
			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		} else {
			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("xhr status = " + status);
		if(status == 0) blocksList.fileLoadState = 500;
		else blocksList.fileLoadState = status;
	}).always(function() {
//		magoManager.fileRequestControler.neoBuildingBlocksListsRequestedCount -= 1;
//		if(magoManager.fileRequestControler.neoBuildingBlocksListsRequestedCount < 0) magoManager.fileRequestControler.neoBuildingBlocksListsRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 파일명
 * @param magoManager 변수
 */
ReaderWriter.prototype.getNeoReferencesArraybuffer = function(fileName, neoRefsList, magoManager) {
	magoManager.fileRequestControler.filesRequestedCount += 1;
	neoRefsList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;
	
	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			neoRefsList.dataArraybuffer = arrayBuffer;
			neoRefsList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		} else {
			neoRefsList.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("xhr status = " + status);
		if(status == 0) neoRefsList.fileLoadState = 500;
		else neoRefsList.fileLoadState = status;
	}).always(function() {
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 파일명
 * @param magoManager 변수
 */
ReaderWriter.prototype.getOctreeLegoArraybuffer = function(fileName, lowestOctree, magoManager) {
	magoManager.fileRequestControler.filesRequestedCount += 1;
	lowestOctree.lego.fileLoadState = CODE.fileLoadState.LOADING_STARTED;
	
	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			if(lowestOctree.lego)
			{
				lowestOctree.lego.dataArrayBuffer = arrayBuffer;
				lowestOctree.lego.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			}
			else{
				lowestOctree = undefined;
			}
			arrayBuffer = null;
		} else {
			lowestOctree.lego.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("xhr status = " + status);
		if(status == 0) lowestOctree.lego.fileLoadState = 500;
		else lowestOctree.lego.fileLoadState = status;
	}).always(function() {
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param fileName 변수
 * @param lodBuilding 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getLodBuildingArraybuffer = function(fileName, lodBuilding, magoManager) {
	magoManager.fileRequestControler.filesRequestedCount += 1;
	lodBuilding.fileLoadState = CODE.fileLoadState.LOADING_STARTED;
	
	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			lodBuilding.dataArraybuffer = arrayBuffer;
			lodBuilding.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		} else {
			lodBuilding.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("xhr status = " + status);
		if(status == 0) lodBuilding.fileLoadState = 500;
		else lodBuilding.fileLoadState = status;
	}).always(function() {
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param arrayBuffer 변수
 * @param filePath_inServer 변수
 * @param terranTile 변수
 * @param readerWriter 변수
 * @param bytes_readed 변수
 * @returns bytes_readed
 */
ReaderWriter.prototype.readTerranTileFile = function(gl, arrayBuffer, filePath_inServer, terranTile, readerWriter, bytes_readed) {
	//var bytes_readed = 0;
//	var f4d_headerPathName_length = 0;
//	var BP_Project;
//	var idxFile;
//	var subTile;

	terranTile._depth = this.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
	if(terranTile._depth == 0) {
		// Read dimensions.***
		terranTile.longitudeMin = this.readFloat64(arrayBuffer, bytes_readed, bytes_readed+8); bytes_readed += 8;
		terranTile.longitudeMax = this.readFloat64(arrayBuffer, bytes_readed, bytes_readed+8); bytes_readed += 8;
		terranTile.latitudeMin = this.readFloat64(arrayBuffer, bytes_readed, bytes_readed+8); bytes_readed += 8;
		terranTile.latitudeMax = this.readFloat64(arrayBuffer, bytes_readed, bytes_readed+8); bytes_readed += 8;
	}

	// Read the max_depth of the quadtree.***
	var max_dpeth = this.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

	// Now, make the quadtree.***
	terranTile.makeTree(max_dpeth);

	return bytes_readed;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param terranTile 변수
 * @param readerWriter 변수
 */
ReaderWriter.prototype.getTerranTileFile = function(gl, fileName, terranTile, readerWriter) {
	// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
//	magoManager.fileRequestControler.filesRequestedCount += 1;
//	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			var bytes_readed = 0;
			readerWriter.readTerranTileFile(gl, arrayBuffer, fileName, terranTile, readerWriter, bytes_readed);

			// Once readed the terranTilesFile, must make all the quadtree.***
			terranTile.setDimensionsSubTiles();
			terranTile.calculatePositionByLonLatSubTiles();
			terranTile.terranIndexFile_readed = true;

//			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		} else {
//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("xhr status = " + xhr.status);
//		if(status == 0) blocksList.fileLoadState = 500;
//		else blocksList.fileLoadState = status;
	}).always(function() {
//		magoManager.fileRequestControler.filesRequestedCount -= 1;
//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param BR_ProjectsList 변수
 * @param readerWriter 변수
 */
ReaderWriter.prototype.getPCloudIndexFile = function(gl, fileName, BR_ProjectsList, readerWriter) {
//	magoManager.fileRequestControler.filesRequestedCount += 1;
//	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			// write code here.***
			var pCloudProject;

			var bytes_readed = 0;

			var f4d_rawPathName_length = 0;
//			var f4d_simpleBuildingPathName_length = 0;
//			var f4d_nailImagePathName_length = 0;

			var pCloudProjects_count = readerWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

			for(var i=0; i<pCloudProjects_count; i++) {
				pCloudProject = new PCloudMesh();
				BR_ProjectsList._pCloudMesh_array.push(pCloudProject);
				pCloudProject._header._f4d_version = 2;
				// 1rst, read the files path names.************************************************************************************************************
				f4d_rawPathName_length = readerWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
				for(var j=0; j<f4d_rawPathName_length; j++) {
					pCloudProject._f4d_rawPathName += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
				}

				pCloudProject._f4d_headerPathName = pCloudProject._f4d_rawPathName + "/pCloud_Header.hed";
				pCloudProject._f4d_geometryPathName = pCloudProject._f4d_rawPathName + "/pCloud_Geo.f4d";

				//BP_Project._f4d_headerPathName = BP_Project._f4d_rawPathName + "_Header.hed";
				//BP_Project._f4d_simpleBuildingPathName = BP_Project._f4d_rawPathName + "_Geom.f4d";
				//BP_Project._f4d_nailImagePathName = BP_Project._f4d_rawPathName + "_Gaia.jpg";
			}
//			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		} else {
//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("xhr status = " + status);
//		if(status == 0) blocksList.fileLoadState = 500;
//		else blocksList.fileLoadState = status;
	}).always(function() {
//		magoManager.fileRequestControler.filesRequestedCount -= 1;
//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param pCloud 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getPCloudHeader = function(gl, fileName, pCloud, readerWriter, magoManager) {
	pCloud._f4d_header_readed = true;
//	magoManager.fileRequestControler.filesRequestedCount += 1;
//	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			// write code here.***

			var bytes_readed = 0;
			var version_string_length = 5;
			var intAux_scratch = 0;
			var auxScratch;
			var header = pCloud._header;

			// 1) Version(5 chars).***********
			for(var j=0; j<version_string_length; j++){
				header._version += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
			}

			// 2) Type (1 byte).**************
			header._type = String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;

			// 3) Global unique ID.*********************
			intAux_scratch = readerWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			for(var j=0; j<intAux_scratch; j++){
				header._global_unique_id += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
			}

			// 4) Location.*************************
			header._latitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
			header._longitude = (new Float64Array(arrayBuffer.slice(bytes_readed, bytes_readed+8)))[0]; bytes_readed += 8;
			header._elevation = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

			header._elevation += 60.0; // delete this. TEST.!!!

			// 5) Orientation.*********************
			auxScratch = new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)); bytes_readed += 4; // yaw.***
			auxScratch = new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)); bytes_readed += 4; // pitch.***
			auxScratch = new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)); bytes_readed += 4; // roll.***

			// 6) BoundingBox.************************
			header._boundingBox.minX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._boundingBox.minY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._boundingBox.minZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._boundingBox.maxX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._boundingBox.maxY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._boundingBox.maxZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

			var isLarge = false;
			if(header._boundingBox.maxX - header._boundingBox.minX > 40.0 || header._boundingBox.maxY - header._boundingBox.minY > 40.0) {
				isLarge = true;
			}

			if(!isLarge && header._boundingBox.maxZ - header._boundingBox.minZ < 30.0) {
				header.isSmall = true;
			}

			// 7) octZerothBox.***********************
			header._octZerothBox.minX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._octZerothBox.minY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._octZerothBox.minZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._octZerothBox.maxX = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._octZerothBox.maxY = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;
			header._octZerothBox.maxZ = (new Float32Array(arrayBuffer.slice(bytes_readed, bytes_readed+4)))[0]; bytes_readed += 4;

			// 8) Data file name.********************
			intAux_scratch = readerWriter.readInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;
			for(var j=0; j<intAux_scratch; j++) {
				header._dataFileName += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytes_readed, bytes_readed+ 1)));bytes_readed += 1;
			}

			// Now, must calculate some params of the project.**********************************************
			// 0) PositionMatrix.************************************************************************
			//var height = elevation;

			var position = Cesium.Cartesian3.fromDegrees(header._longitude, header._latitude, header._elevation); // Old.***
			pCloud._pCloudPosition = position;

			// High and Low values of the position.****************************************************
			var splitValue = Cesium.EncodedCartesian3.encode(position);
			var splitVelue_X  = Cesium.EncodedCartesian3.encode(position.x);
			var splitVelue_Y  = Cesium.EncodedCartesian3.encode(position.y);
			var splitVelue_Z  = Cesium.EncodedCartesian3.encode(position.z);

			pCloud._pCloudPositionHIGH = new Float32Array(3);
			pCloud._pCloudPositionHIGH[0] = splitVelue_X.high;
			pCloud._pCloudPositionHIGH[1] = splitVelue_Y.high;
			pCloud._pCloudPositionHIGH[2] = splitVelue_Z.high;

			pCloud._pCloudPositionLOW = new Float32Array(3);
			pCloud._pCloudPositionLOW[0] = splitVelue_X.low;
			pCloud._pCloudPositionLOW[1] = splitVelue_Y.low;
			pCloud._pCloudPositionLOW[2] = splitVelue_Z.low;

			if(magoManager.backGround_fileReadings_count > 0 ) magoManager.backGround_fileReadings_count -=1;

			pCloud._f4d_header_readed_finished = true;
//			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		} else {
//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("xhr status = " + status);
//		if(status == 0) blocksList.fileLoadState = 500;
//		else blocksList.fileLoadState = status;
	}).always(function() {
//		magoManager.fileRequestControler.filesRequestedCount -= 1;
//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
 * @param gl gl context
 * @param fileName 파일명
 * @param readerWriter 파일 처리를 담당
 * @param neoBuildingsList object index 파일을 파싱한 정보를 저장할 배열
 */
ReaderWriter.prototype.getObjectIndexFile = function(fileName, readerWriter, neoBuildingsList, magoManager) {
//	magoManager.fileRequestControler.filesRequestedCount += 1;
//	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			readerWriter.parseObjectIndexFile(arrayBuffer, neoBuildingsList);
//			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
			magoManager.createDeploymentGeoLocationsForHeavyIndustries();
		} else {
//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("xhr status = " + status);
//		if(status == 0) blocksList.fileLoadState = 500;
//		else blocksList.fileLoadState = status;
	}).always(function() {
//		magoManager.fileRequestControler.filesRequestedCount -= 1;
//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * object index 파일을 읽어서 빌딩 개수, 포지션, 크기 정보를 배열에 저장
 * @param arrayBuffer object index file binary data
 * @param neoBuildingsList object index 파일을 파싱한 정보를 저장할 배열
 */
ReaderWriter.prototype.parseObjectIndexFile = function(arrayBuffer, neoBuildingsList) {
	var bytesReaded = 0;
	var buildingNameLength;
	var longitude;
	var latitude;
	var altitude;
	var bbLengthX;
	var bbLengthY;
	var bbLengthZ;
	var heading;
	var pitch;
	var roll;

	var buildingsCount = this.readInt32(arrayBuffer, bytesReaded, bytesReaded+4);
	bytesReaded += 4;
	for(var i =0; i<buildingsCount; i++) {
		// read the building location data.***
		var neoBuilding = neoBuildingsList.newNeoBuilding();

		buildingNameLength = this.readInt32(arrayBuffer, bytesReaded, bytesReaded+4);
		bytesReaded += 4;
		var buildingName = String.fromCharCode.apply(null, new Int8Array(arrayBuffer.slice(bytesReaded, bytesReaded+ buildingNameLength)));
		bytesReaded += buildingNameLength;
		/* khj(20170331)
		var buildingName = "";
		for(var j=0; j<buildingNameLength; j++) {
			buildingName += String.fromCharCode(new Int8Array(arrayBuffer.slice(bytesReaded, bytesReaded+ 1)));bytesReaded += 1;
		}
		*/

		longitude = this.readFloat64(arrayBuffer, bytesReaded, bytesReaded+8); bytesReaded += 8;
		latitude = this.readFloat64(arrayBuffer, bytesReaded, bytesReaded+8); bytesReaded += 8;
		altitude = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;

		//longitude = 128.594998;
		//latitude = 34.904209;
		//altitude = 50.0;
		// sangamdong 37.577984, 126.894383

		heading = 0.0;
		pitch = 0.0;
		roll = 0.0;

		// TEST.*********
		altitude = 50.0;
		neoBuilding.bbox = new BoundingBox();
		neoBuilding.bbox.minX = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		neoBuilding.bbox.minY = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		neoBuilding.bbox.minZ = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		neoBuilding.bbox.maxX = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		neoBuilding.bbox.maxY = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;
		neoBuilding.bbox.maxZ = this.readFloat32(arrayBuffer, bytesReaded, bytesReaded+4); bytesReaded += 4;

		// create a building and set the location.***
		//var neoBuilding_header_path = this.geometryDataPath + "/"+buildingFileName+"/Header.hed";
		var buildingNameDivided = buildingName.split("_");
		if(buildingNameDivided[2] != undefined)
		{
			neoBuilding.buildingId = buildingNameDivided[1] + "_" + buildingNameDivided[2];
			neoBuilding.buildingType = buildingNameDivided[3];
		}
		else
		{
			neoBuilding.buildingId = buildingNameDivided[1];
			neoBuilding.buildingType = buildingNameDivided[3];
		}
		
		if(neoBuilding.buildingType == undefined)
		{
			neoBuilding.buildingType = "basicBuilding";
		}
		
		/* khj(20170331) : before converted jt data path has been changed.
		var buildingNameDivided = buildingName.split("-");
		var tempBuildingId = buildingNameDivided[2].split("_");
		neoBuilding.buildingId = tempBuildingId[0];
		neoBuilding.buildingType = buildingNameDivided[1];
		*/

		neoBuilding.buildingFileName = buildingName;
		if(neoBuilding.metaData == undefined) {
			neoBuilding.metaData = new MetaData();
		}
		if(neoBuilding.metaData.geographicCoord == undefined)
			neoBuilding.metaData.geographicCoord = new GeographicCoord();

		neoBuilding.metaData.geographicCoord.setLonLatAlt(longitude, latitude, altitude);

		if(neoBuilding.metaData.bbox == undefined) {
			neoBuilding.metaData.bbox = new BoundingBox();
		}

		var bbox = neoBuilding.metaData.bbox;

		bbox.minX = neoBuilding.bbox.minX;
		bbox.minY = neoBuilding.bbox.minY;
		bbox.minZ = neoBuilding.bbox.minZ;

		bbox.maxX = neoBuilding.bbox.maxX;
		bbox.maxY = neoBuilding.bbox.maxY;
		bbox.maxZ = neoBuilding.bbox.maxZ;
	}

	neoBuildingsList.neoBuildingsArray.reverse();
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param neoBuilding 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getNeoHeader = function(gl, fileName, neoBuilding, readerWriter, magoManager) {
	//BR_Project._f4d_header_readed = true;
	magoManager.fileRequestControler.filesRequestedCount += 1;
	neoBuilding.metaData.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			if(neoBuilding.metaData == undefined) {
				neoBuilding.metaData = new MetaData();
			}
			neoBuilding.metaData.parseFileHeader(arrayBuffer, readerWriter);

			// Now, make the neoBuilding's octree.***
			if(neoBuilding.octree == undefined) neoBuilding.octree = new Octree(undefined);

			neoBuilding.octree.setBoxSize(neoBuilding.metaData.oct_min_x, neoBuilding.metaData.oct_max_x,
				neoBuilding.metaData.oct_min_y, neoBuilding.metaData.oct_max_y,
				neoBuilding.metaData.oct_min_z, neoBuilding.metaData.oct_max_z);

			neoBuilding.octree.makeTree(3);
			neoBuilding.octree.setSizesSubBoxes();

			neoBuilding.metaData.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			//if(magoManager.backGround_fileReadings_count > 0 )
			//    magoManager.backGround_fileReadings_count -= 1; // old.***
			//BR_Project._f4d_header_readed_finished = true;
			arrayBuffer = null;
		} else {
			neoBuilding.metaData.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("xhr status = " + status);
		if(status == 0) neoBuilding.metaData.fileLoadState = 500;
		else neoBuilding.metaData.fileLoadState = status;
	}).always(function() {
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param neoBuilding 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getNeoHeaderAsimetricVersion = function(gl, fileName, neoBuilding, readerWriter, magoManager) {
	//BR_Project._f4d_header_readed = true;
	magoManager.fileRequestControler.filesRequestedCount += 1;
	neoBuilding.metaData.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			if(neoBuilding.metaData == undefined) {
				neoBuilding.metaData = new MetaData();
			}
			var bytesReaded = neoBuilding.metaData.parseFileHeaderAsimetricVersion(arrayBuffer, readerWriter);

			// Now, make the neoBuilding's octree.***
			if(neoBuilding.octree == undefined) neoBuilding.octree = new Octree(undefined);

			// now, parse octreeAsimetric.***
			neoBuilding.octree.parseAsimetricVersion(arrayBuffer, readerWriter, bytesReaded, neoBuilding);

			neoBuilding.metaData.oct_min_x = neoBuilding.octree.centerPos.x - neoBuilding.octree.half_dx;
			neoBuilding.metaData.oct_max_x = neoBuilding.octree.centerPos.x + neoBuilding.octree.half_dx;
			neoBuilding.metaData.oct_min_y = neoBuilding.octree.centerPos.y - neoBuilding.octree.half_dy;
			neoBuilding.metaData.oct_max_y = neoBuilding.octree.centerPos.y + neoBuilding.octree.half_dy;
			neoBuilding.metaData.oct_min_z = neoBuilding.octree.centerPos.z - neoBuilding.octree.half_dz;
			neoBuilding.metaData.oct_max_z = neoBuilding.octree.centerPos.z + neoBuilding.octree.half_dz;

			neoBuilding.metaData.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;

			// test for 1500 blocks.***
			/*
			if(neoBuilding.bbox == undefined)
				neoBuilding.bbox = new BoundingBox();
			neoBuilding.bbox.minX = neoBuilding.metaData.oct_min_x;
			neoBuilding.bbox.minY = neoBuilding.metaData.oct_min_y;
			neoBuilding.bbox.minZ = neoBuilding.metaData.oct_min_z;
			neoBuilding.bbox.maxX = neoBuilding.metaData.oct_max_x;
			neoBuilding.bbox.maxY = neoBuilding.metaData.oct_max_y;
			neoBuilding.bbox.maxZ = neoBuilding.metaData.oct_max_z;
			*/
			// end // test for 1500 blocks.***

			//BR_Project._f4d_header_readed_finished = true;
			arrayBuffer = undefined;
		} else {
			neoBuilding.metaData.fileLoadState = 500;
			arrayBuffer = undefined;
		}
	}).fail(function(status) {
		console.log("xhr status = " + status);
		if(status == 0) neoBuilding.metaData.fileLoadState = 500;
		else neoBuilding.metaData.fileLoadState = status;
	}).always(function() {
		magoManager.fileRequestControler.filesRequestedCount -= 1;
		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param imageArrayBuffer 변수
 * @param BR_Project 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 * @param imageLod 변수
 */
ReaderWriter.prototype.readNailImageOfArrayBuffer = function(gl, imageArrayBuffer, BR_Project, readerWriter, magoManager, imageLod) {
	var simpBuildingV1 = BR_Project._simpleBuilding_v1;
	var blob = new Blob( [ imageArrayBuffer ], { type: "image/jpeg" } );
	var urlCreator = window.URL || window.webkitURL;
	var imagenUrl = urlCreator.createObjectURL(blob);
	var simpleBuildingImage = new Image();

	simpleBuildingImage.onload = function () {
		//console.log("Image Onload");
		if(simpBuildingV1._simpleBuildingTexture == undefined)
			simpBuildingV1._simpleBuildingTexture = gl.createTexture();
		handleTextureLoaded(gl, simpleBuildingImage, simpBuildingV1._simpleBuildingTexture);
		BR_Project._f4d_nailImage_readed_finished = true;
		imageArrayBuffer = null;
		BR_Project._simpleBuilding_v1.textureArrayBuffer = null;

		if(magoManager.backGround_imageReadings_count > 0) {
			magoManager.backGround_imageReadings_count--;
		}
	};

	simpleBuildingImage.onerror = function() {
		// doesn't exist or error loading

		//BR_Project._f4d_lod0Image_readed_finished = false;
		//BR_Project._f4d_lod0Image_exists = false;
		//if(magoManager.backGround_fileReadings_count > 0 )
		//	  magoManager.backGround_fileReadings_count -=1;

		return;
	};

	simpleBuildingImage.src = imagenUrl;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param BR_Project 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 * @param imageLod 변수
 */
ReaderWriter.prototype.readNailImage = function(gl, filePath_inServer, BR_Project, readerWriter, magoManager, imageLod) {
	if(imageLod == undefined) imageLod = 3; // The lowest lod.***

	if(imageLod == 3) BR_Project._f4d_nailImage_readed = true;
	else if(imageLod == 0) BR_Project._f4d_lod0Image_readed  = true;

	if(BR_Project._simpleBuilding_v1 == undefined) BR_Project._simpleBuilding_v1 = new SimpleBuildingV1();

	var simpBuildingV1 = BR_Project._simpleBuilding_v1;

	var simpleBuildingImage = new Image();
	simpleBuildingImage.onload = function() {
	/*
		if(magoManager.render_time > 20)// for the moment is a test.***
		{
			if(imageLod == 3)
				BR_Project._f4d_nailImage_readed = false;
			else if(imageLod == 0)
				BR_Project._f4d_lod0Image_readed  = false;

			if(magoManager.backGround_fileReadings_count > 0 )
			  magoManager.backGround_fileReadings_count -=1;

			return;
		}
		*/

		if(imageLod == 3) {
			handleTextureLoaded(gl, simpleBuildingImage, simpBuildingV1._simpleBuildingTexture);
			BR_Project._f4d_nailImage_readed_finished = true;
		} else if(imageLod == 0) {
			if(simpBuildingV1._texture_0 == undefined) simpBuildingV1._texture_0 = gl.createTexture();

			handleTextureLoaded(gl, simpleBuildingImage, simpBuildingV1._texture_0);
			BR_Project._f4d_lod0Image_readed_finished = true;
		}

		if(magoManager.backGround_fileReadings_count > 0 ) magoManager.backGround_fileReadings_count -=1;
	};

	simpleBuildingImage.onerror = function() {
		// doesn't exist or error loading
		BR_Project._f4d_lod0Image_readed_finished = false;
		BR_Project._f4d_lod0Image_exists = false;
		if(magoManager.backGround_fileReadings_count > 0 ) magoManager.backGround_fileReadings_count -=1;
		return;
	};

	var filePath_inServer_SimpleBuildingImage = filePath_inServer;
	simpleBuildingImage.src = filePath_inServer_SimpleBuildingImage;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param f4dTex 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.readTexture = function(gl, filePath_inServer, f4dTex, magoManager) {
	f4dTex.loadStarted = true;
	f4dTex.texImage = new Image();
	f4dTex.texImage.onload = function() {
		f4dTex.loadFinished = true;

		if(magoManager.backGround_fileReadings_count > 0 ) magoManager.backGround_fileReadings_count -=1;
	};

	f4dTex.texImage.onerror = function() {
		// doesn't exist or error loading
		f4dTex.loadStarted = false;
		if(magoManager.backGround_fileReadings_count > 0 ) magoManager.backGround_fileReadings_count -=1;
		return;
	};

	f4dTex.texImage.src = filePath_inServer;
};

ReaderWriter.prototype.decodeTGA = function(arrayBuffer) {
	// code from toji.***
	var content = new Uint8Array(arrayBuffer),
		contentOffset = 18 + content[0],
		imagetype = content[2], // 2 = rgb, only supported format for now
		width = content[12] + (content[13] << 8),
		height = content[14] + (content[15] << 8),
		bpp = content[16], // should be 8,16,24,32
		
		bytesPerPixel = bpp / 8,
		bytesPerRow = width * 4,
		data, i, j, x, y;

	if(!width || !height) {
		console.error("Invalid dimensions");
		return null;
	}

	if (imagetype != 2) {
		console.error("Unsupported TGA format:", imagetype);
		return null;
	}

	data = new Uint8Array(width * height * 4);
	i = contentOffset;

	// Oy, with the flipping of the rows...
	for(y = height-1; y >= 0; --y) {
		for(x = 0; x < width; ++x, i += bytesPerPixel) {
			j = (x * 4) + (y * bytesPerRow);
			data[j] = content[i+2];
			data[j+1] = content[i+1];
			data[j+2] = content[i+0];
			data[j+3] = (bpp === 32 ? content[i+3] : 255);
		}
	}

	return {
		width: width,
		height: height,
		data: data
	};
}

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param texture 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.readNeoReferenceTexture = function(gl, filePath_inServer, texture, neoBuilding, magoManager) {
	// Must know the fileExtension.***
	var extension = filePath_inServer.split('.').pop();
	
	if(extension == "tga" || extension == "TGA" || extension == "Tga")
	{
		loadWithXhr(filePath_inServer).done(function(response) 
		{
			var arrayBuffer = response;
			if(arrayBuffer) {
				// decode tga.***
				var tga = magoManager.readerWriter.decodeTGA(arrayBuffer);
				if(tga) {
                    gl.bindTexture(gl.TEXTURE_2D, texture.texId);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tga.width, tga.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, tga.data);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
					gl.generateMipmap(gl.TEXTURE_2D);
					texture.fileLoadState = CODE.fileLoadState.LOADING_FINISHED; // file load finished.***
                }
			}
		}).fail(function(status) {
			console.log("xhr status = " + status);
			if(status == 0) neoBuilding.metaData.fileLoadState = 500;
			else neoBuilding.metaData.fileLoadState = status;
		}).always(function() {
			//magoManager.fileRequestControler.filesRequestedCount -= 1;
			//if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
		});
	}
	else{
		var neoRefImage = new Image();
		texture.fileLoadState = CODE.fileLoadState.LOADING_STARTED; // file load started.***
		//magoManager.backGround_fileReadings_count ++;
		neoRefImage.onload = function() {
			//if(texture.texId == undefined) 
			//	texture.texId = gl.createTexture();

			handleTextureLoaded(gl, neoRefImage, texture.texId);
			texture.fileLoadState = CODE.fileLoadState.LOADING_FINISHED; // file load finished.***
			//neoBuilding.texturesLoaded.push(texture);

			if(magoManager.backGround_fileReadings_count > 0 ) 
				magoManager.backGround_fileReadings_count -=1;
		};

		neoRefImage.onerror = function() {
			// doesn't exist or error loading
			return;
		};
		neoRefImage.src = filePath_inServer;
	}

	
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param texture 변수
 * @param neoBuilding 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.readLegoSimpleBuildingTexture = function(gl, filePath_inServer, texture, magoManager) {
	var neoRefImage = new Image();
	//magoManager.backGround_fileReadings_count ++;
	neoRefImage.onload = function() {
		if(texture.texId == undefined) 
			texture.texId = gl.createTexture();

		handleTextureLoaded(gl, neoRefImage, texture.texId);

		if(magoManager.backGround_fileReadings_count > 0 ) magoManager.backGround_fileReadings_count -=1;
	};

	neoRefImage.onerror = function() {
		// doesn't exist or error loading
		return;
	};

	neoRefImage.src = filePath_inServer;
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param terranTile 변수
 * @param readerWriter 변수
 */
ReaderWriter.prototype.openTerranTile = function(gl, terranTile, readerWriter ) {
	var filePath_inServer = this.geometryDataPath + Constant.RESULT_XDO2F4D_TERRAINTILEFILE_TXT;
	readerWriter.getTerranTileFile(gl, filePath_inServer, terranTile, readerWriter);
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param fileName 변수
 * @param terranTile 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getTileArrayBuffer = function(gl, fileName, terranTile, readerWriter, magoManager) {
	// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
	terranTile.fileReading_started = true;
//	magoManager.fileRequestControler.backGround_fileReadings_count += 1;
//	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			//var BR_Project = new BRBuildingProject(); // Test.***
			//readerWriter.readF4D_Header(gl, arrayBuffer, BR_Project ); // Test.***
			terranTile.fileArrayBuffer = arrayBuffer;
			terranTile.fileReading_finished = true;

			if(magoManager.backGround_fileReadings_count > 0 ) magoManager.backGround_fileReadings_count -=1;
//			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			arrayBuffer = null;
		} else {
//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("xhr status = " + status);
//		if(status == 0) blocksList.fileLoadState = 500;
//		else blocksList.fileLoadState = status;
	}).always(function() {
//		magoManager.fileRequestControler.filesRequestedCount -= 1;
//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param filePath_inServer 변수
 * @param pCloud 변수
 * @param readerWriter 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.getPCloudGeometry = function(gl, fileName, pCloud, readerWriter, magoManager) {
	// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
	pCloud._f4d_geometry_readed = true;
//	magoManager.fileRequestControler.filesRequestedCount += 1;
//	blocksList.fileLoadState = CODE.fileLoadState.LOADING_STARTED;

	loadWithXhr(fileName).done(function(response) {
		var arrayBuffer = response;
		if(arrayBuffer) {
			// write code here.***
			var bytes_readed = 0;
			var startBuff;
			var endBuff;

			var meshes_count = readerWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4; // Almost allways is 1.***
			for(var a=0; a<meshes_count; a++) {
				var vbo_objects_count = readerWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4; // Almost allways is 1.***

				// single interleaved buffer mode.*********************************************************************************
				for(var i=0; i<vbo_objects_count; i++) {
					var vbo_vertexIdx_data = pCloud.vbo_datas.newVBOVertexIdxCacheKey();
					//var vt_cacheKey = simpObj._vtCacheKeys_container.newVertexTexcoordsArraysCacheKey();

					var iDatas_count = readerWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4; // iDatasCount = vertexCount.***
					startBuff = bytes_readed;
					//endBuff = bytes_readed + (4*3+1*3+1*4)*iDatas_count; // pos(float*3) + normal(byte*3) + color4(byte*4).***
					endBuff = bytes_readed + (4*3+4*3+1*4)*iDatas_count; // pos(float*3) + normal(float*3) + color4(byte*4).***

					//vt_cacheKey._verticesArray_cacheKey = gl.createBuffer ();
					vbo_vertexIdx_data.meshVertexCacheKey = gl.createBuffer ();
					gl.bindBuffer(gl.ARRAY_BUFFER, vbo_vertexIdx_data.meshVertexCacheKey);
					gl.bufferData(gl.ARRAY_BUFFER, arrayBuffer.slice(startBuff, endBuff), gl.STATIC_DRAW);

					//bytes_readed = bytes_readed + (4*3+1*3+1*4)*iDatas_count; // pos(float*3) + normal(byte*3) + color4(byte*4).*** // updating data.***
					bytes_readed = bytes_readed + (4*3+4*3+1*4)*iDatas_count; // pos(float*3) + normal(float*3) + color4(byte*4).*** // updating data.***

					//vt_cacheKey._vertices_count = iDatas_count;
					// Now, read short indices.***
					var shortIndices_count = readerWriter.readUInt32(arrayBuffer, bytes_readed, bytes_readed+4); bytes_readed += 4;

					vbo_vertexIdx_data.indicesCount = shortIndices_count;

					// Indices.***********************
					startBuff = bytes_readed;
					endBuff = bytes_readed + 2*shortIndices_count;
					/*
					// Test.***************************************************************************************
					for(var counter = 0; counter<shortIndices_count; counter++)
					{
						var shortIdx = new Uint16Array(arrayBuffer.slice(bytes_readed, bytes_readed+2));bytes_readed += 2;
						if(shortIdx[0] >= iDatas_count)
						{
							var h=0;
						}
					}
					bytes_readed -= 2*shortIndices_count;
					// End test.------------------------------------------------------------------------------------
					*/

					vbo_vertexIdx_data.meshFacesCacheKey= gl.createBuffer ();
					gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vbo_vertexIdx_data.meshFacesCacheKey);
					gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(arrayBuffer.slice(startBuff, endBuff)), gl.STATIC_DRAW);

					bytes_readed = bytes_readed + 2*shortIndices_count; // updating data.***
				}
			}

//			blocksList.fileLoadState = CODE.fileLoadState.LOADING_FINISHED;
			if(magoManager.backGround_fileReadings_count > 0 ) magoManager.backGround_fileReadings_count -=1;

			pCloud._f4d_geometry_readed_finished = true;
			arrayBuffer = null;
		} else {
//			blocksList.fileLoadState = 500;
		}
	}).fail(function(status) {
		console.log("xhr status = " + status);
//		if(status == 0) blocksList.fileLoadState = 500;
//		else blocksList.fileLoadState = status;
	}).always(function() {
//		magoManager.fileRequestControler.filesRequestedCount -= 1;
//		if(magoManager.fileRequestControler.filesRequestedCount < 0) magoManager.fileRequestControler.filesRequestedCount = 0;
	});
};

/**
 * 어떤 일을 하고 있습니까?
 * @param gl 변수
 * @param buildingFileName 변수
 * @param latitude 변수
 * @param longitude 변수
 * @param height 변수
 * @param readerWriter 변수
 * @param NeoBuildingsList 변수
 * @param magoManager 변수
 */
ReaderWriter.prototype.openNeoBuilding = function(gl, buildingFileName, latitude, longitude, height, readerWriter, NeoBuildingsList, magoManager) {
	// This is a test function to read the new f4d format.***
	// The location(latitude, longitude, height) is provisional.***

	// Read the header.***
	var neoBuilding_header_path = this.geometryDataPath + "/"+buildingFileName+"/Header.hed";
	var neoBuilding = NeoBuildingsList.newNeoBuilding();

	neoBuilding.buildingFileName = buildingFileName;

	if(neoBuilding.octree == undefined) neoBuilding.octree = new Octree(undefined);

	readerWriter.getNeoHeader(gl, neoBuilding_header_path, neoBuilding, readerWriter, magoManager); // Here makes the tree of octree.***

	// 0) PositionMatrix.************************************************************************
	//var height = elevation;
	var position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height); // Old.***
	//var position = absolutePosition;
	neoBuilding.buildingPosition = position;

	// High and Low values of the position.****************************************************
	var splitValue = Cesium.EncodedCartesian3.encode(position); // no works.***
	var splitVelue_X  = Cesium.EncodedCartesian3.encode(position.x);
	var splitVelue_Y  = Cesium.EncodedCartesian3.encode(position.y);
	var splitVelue_Z  = Cesium.EncodedCartesian3.encode(position.z);

	neoBuilding.buildingPositionHIGH = new Float32Array(3);
	neoBuilding.buildingPositionHIGH[0] = splitVelue_X.high;
	neoBuilding.buildingPositionHIGH[1] = splitVelue_Y.high;
	neoBuilding.buildingPositionHIGH[2] = splitVelue_Z.high;

	neoBuilding.buildingPositionLOW = new Float32Array(3);
	neoBuilding.buildingPositionLOW[0] = splitVelue_X.low;
	neoBuilding.buildingPositionLOW[1] = splitVelue_Y.low;
	neoBuilding.buildingPositionLOW[2] = splitVelue_Z.low;
	// End.-----------------------------------------------------------------------------------

	// Determine the elevation of the position.***********************************************************
	var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
	var height = cartographic.height;
	// End Determine the elevation of the position.-------------------------------------------------------
	neoBuilding.move_matrix = new Float32Array(16); // PositionMatrix.***
	neoBuilding.moveMatrixInv = new Float32Array(16); // Inverse of PositionMatrix.***

	Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, neoBuilding.move_matrix);
	neoBuilding.transfMat_inv = new Float32Array(16);
	Cesium.Matrix4.inverse(neoBuilding.move_matrix, neoBuilding.transfMat_inv);

	neoBuilding.move_matrix[12] = 0;
	neoBuilding.move_matrix[13] = 0;
	neoBuilding.move_matrix[14] = 0;
	neoBuilding.buildingPosition = position;
	// note: "neoBuilding.move_matrix" is only rotation matrix.***

	Cesium.Matrix4.inverse(neoBuilding.move_matrix, neoBuilding.moveMatrixInv);

	// 1) Blocks.*******************************************************************************************************************************
	var blocksListContainer = neoBuilding._blocksList_Container;
	var filePath_inServer = "";

	filePath_inServer = this.geometryDataPath + "/"+buildingFileName+"/Blocks1";
	var blocksList = blocksListContainer.getBlockList("Blocks1");
	readerWriter.getNeoBlocks(gl, filePath_inServer, blocksList, readerWriter);

	var filePath_inServer_2 = this.geometryDataPath + "/"+buildingFileName+"/Blocks2";
	var blocksList_2 = blocksListContainer.getBlockList("Blocks2");
	readerWriter.getNeoBlocks(gl, filePath_inServer_2, blocksList_2, readerWriter);

	var filePath_inServer_3 = this.geometryDataPath + "/"+buildingFileName+"/Blocks3";
	var blocksList_3 = blocksListContainer.getBlockList("Blocks3");
	readerWriter.getNeoBlocks(gl, filePath_inServer_3, blocksList_3, readerWriter);

	var filePath_inServer_bone = this.geometryDataPath + "/"+buildingFileName+"/BlocksBone";
	var blocksList_bone = blocksListContainer.getBlockList("BlocksBone");
	readerWriter.getNeoBlocks(gl, filePath_inServer_bone, blocksList_bone, readerWriter);

	var filePath_inServer_4 = this.geometryDataPath + "/"+buildingFileName+"/Blocks4"; // Interior Objects.***
	var blocksList_4 = blocksListContainer.getBlockList("Blocks4");
	readerWriter.getNeoBlocks(gl, filePath_inServer_4, blocksList_4, readerWriter);

	// 2) References.****************************************************************************************************************************
	var moveMatrix = new Matrix4();
	moveMatrix.setByFloat32Array(neoBuilding.move_matrix);
	var lod_level = 0;

	var neoRefList_container = neoBuilding._neoRefLists_Container;

	lod_level = 0;
	filePath_inServer = this.geometryDataPath + "/" + buildingFileName + "/Ref_Skin1";
	readerWriter.getNeoReferences(gl, filePath_inServer, neoRefList_container, "Ref_Skin1", lod_level, blocksList, moveMatrix, neoBuilding, readerWriter, undefined);

	lod_level = 1;
	filePath_inServer = this.geometryDataPath + "/" + buildingFileName + "/Ref_Skin2";
	readerWriter.getNeoReferences(gl, filePath_inServer, neoRefList_container, "Ref_Skin2", lod_level, blocksList_2, moveMatrix, neoBuilding, readerWriter, undefined);

	lod_level = 2;
	filePath_inServer = this.geometryDataPath + "/" + buildingFileName + "/Ref_Skin3";
	readerWriter.getNeoReferences(gl, filePath_inServer, neoRefList_container, "Ref_Skin3", lod_level, blocksList_3, moveMatrix, neoBuilding, readerWriter, undefined);

	lod_level = 3;
	filePath_inServer = this.geometryDataPath + "/" + buildingFileName + "/Ref_Bone";
	readerWriter.getNeoReferences(gl, filePath_inServer, neoRefList_container, "Ref_Bone", lod_level, blocksList_bone, moveMatrix, neoBuilding, readerWriter, undefined);

	// Now, read the interior objects in octree format.**********************************************************************************************
	var interiorCRef_folderPath = this.geometryDataPath + "/" + buildingFileName + "/inLOD4";
	lod_level = 4;
	//var interior_base_name = "Ref_NodeData";
	var subOctreeName_counter = -1;

	for(var i=1; i<9; i++) {
		for(var j=1; j<9; j++) {
			for(var k=1; k<9; k++) {
				subOctreeName_counter = i*100 + j*10 + k;
				var interiorCRef_fileName = subOctreeName_counter.toString();

				// Create a "compoundRefList".************************************************
				var intCompRef_filePath = interiorCRef_folderPath + "/" + interiorCRef_fileName;
				//readerWriter.readF4D_CompoundReferences_inServer(gl, intCompRef_filePath, null, interiorCRef_fileName, 4, blocksList_4, moveMatrix, BR_buildingProject, readerWriter, subOctreeName_counter);
				readerWriter.getNeoReferences(gl, intCompRef_filePath, null, interiorCRef_fileName, lod_level, blocksList_4, moveMatrix, neoBuilding, readerWriter, subOctreeName_counter);
			}
		}
	}

	// Now, read the simple building.************************
	neoBuilding.neoSimpleBuilding = new NeoSimpleBuilding();
	filePath_inServer = this.geometryDataPath + "/"+buildingFileName+"/SimpleBuilding";
	readerWriter.getNeoSimpleBuilding(gl, filePath_inServer, neoBuilding.neoSimpleBuilding, readerWriter);
};

//load neoTextures
ReaderWriter.prototype.handleTextureLoaded = function(gl, image, texture) {
	// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL
	//var gl = viewer.scene.context._gl;
	gl.bindTexture(gl.TEXTURE_2D, texture);
	//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true); // if need vertical mirror of the image.***
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); // Original.***
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
};
