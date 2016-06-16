/**
 * @author felixturner / http://airtight.cc/
 *
 * Mirror Shader
 * Copies half the input to the other half
 *
 * side: side of input to mirror (0 = left, 1 = right, 2 = top, 3 = bottom)
 */

THREE.BrightShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"amount":     { type: "f", value: 4.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float amount;",
		
		"varying vec2 vUv;",

		"void main() {",

			"vec2 p = vUv;",
			"vec4 color = texture2D(tDiffuse, p);",
			"gl_FragColor = color * amount;",

		"}"

	].join( "\n" )

};