const textSectionSite = document.getElementById('textSection');
const modalSite = document.getElementById('photoModal');
let tallTitle = true;
let wantToInsert;
// let nanseiBound=[35.645672,139.707843];
// let hokutoBound=[35.709909,139.850320];
let nanseiBound=[0,0];
let hokutoBound=[90,180];

let geoJsonURL = 'CHUORIVER.geojson';
let dotJsonURL = 'CHUORIVERDOT.geojson';
// let geoJsonURL = 'https://raw.githubusercontent.com/ml24sinatori/chuorivermap/main/CHUORIVER.geojson';
// let dotJsonURL = 'https://raw.githubusercontent.com/ml24sinatori/chuorivermap/main/CHUORIVERDOT.geojson';