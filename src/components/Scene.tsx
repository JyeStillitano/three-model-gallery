"use client"

import * as THREE from "three"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useLoader } from "@react-three/fiber"
import { Text } from "@react-three/drei"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

import { Perf } from "r3f-perf"

import { easing } from "maath"

// Easing Camera - Look At Mouse
function Camera() {
	const targetPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0)

	useFrame((state, delta) => {
		targetPosition.set(
			1 + (state.pointer.x * state.viewport.width) / 3,
			(20 + state.pointer.y) / 2,
			15,
		)

		easing.damp3(state.camera.position, targetPosition, 0.5, delta)
		state.camera.lookAt(0, 3, 0)
	})
	return <></>
}

// Backdrop / Floor
function Background() {
	return (
		<>
			<mesh position={[0, 20, 0]} receiveShadow>
				<boxGeometry args={[100, 40, 40]} />
				<meshStandardMaterial side={THREE.BackSide} color="white" />
			</mesh>
		</>
	)
}

// Ambient and point lighting.
function Lighting() {
	// TODO: simpler shadows for mobile.

	return (
		<>
			<ambientLight intensity={0.3} />
			<pointLight
				position={[3, 5, 3]}
				intensity={40}
				distance={20}
				decay={2}
				castShadow
				shadow-mapSize-width={2048} // Increase shadow resolution
				shadow-mapSize-height={2048} // Increase shadow resolution
			/>
		</>
	)
}

function Gameboy() {
	// Load gameboy model.
	const model = useLoader(GLTFLoader, "/gameboy/scene.gltf")

	// Configure shadows for all meshes.
	model.scene.traverse((child) => {
		if ((child as THREE.Mesh).isMesh) {
			const mesh = child as THREE.Mesh
			mesh.castShadow = true
		}
	})

	// Scale and return primitive object.
	return (
		<mesh
			position={[0, 3.8, 0]}
			rotation={[0, Math.PI, 0]}
			scale={[0.5, 0.5, 0.5]}
			castShadow
		>
			<primitive object={model.scene} />
		</mesh>
	)
}

function Information() {
	return (
		<>
			<Text
				color="white"
				font="/fonts/AtkinsonHyperlegibleMono-VariableFont_wght.ttf"
				fontSize={2}
				anchorX="center"
				position={[0, 10, -2]}
				rotation={[-0.5, 0, 0]}
			>
				Nintendo Gameboy
			</Text>
			<Text
				color="white"
				font="/fonts/AtkinsonHyperlegibleMono-VariableFont_wght.ttf"
				fontSize={0.5}
				anchorX="center"
				position={[-7.5, 5, 0.75]}
				rotation={[-0.5, 0, 0]}
				maxWidth={5}
			>
				Now you can have that exciting Nintendo action anywhere with the new
				GAME BOY video system. Just pop it in your pocket and pull it out
				anytime.
			</Text>
			<Text
				color="white"
				font="/fonts/AtkinsonHyperlegibleMono-VariableFont_wght.ttf"
				fontSize={0.5}
				anchorX="center"
				position={[6.5, 5, 0.75]}
				rotation={[-0.5, 0, 0]}
				maxWidth={7}
			>
				With a video link that hooks up to another GAME BOY system for 2-player
				competition, stereo headphones, external speaker, battery and Tetris
				cartridge, you can take the GAME BOY to the beach, park or playground.
			</Text>

			<Text
				color="white"
				font="/fonts/AtkinsonHyperlegibleMono-VariableFont_wght.ttf"
				fontSize={1.75}
				anchorX="center"
				position={[0, 0.1, 3.5]}
				rotation={[-Math.PI / 2, 0, 0]}
			>
				Compact Game System
			</Text>
		</>
	)
}

export default function Scene() {
	// Camera Controller
	// https://codesandbox.io/p/sandbox/bst0cy?file=%2Fsrc%2FApp.js%3A40%2C51-40%2C59

	// Good example of decreasing quality on demand:
	// https://codesandbox.io/p/sandbox/szj6p7?file=%2Fsrc%2FApp.js%3A111%2C16-111%2C25

	return (
		<Canvas shadows>
			<Camera />
			<Lighting />
			<Gameboy />
			<Information />
			<Background />
			{/* <Perf position="top-right" /> */}
		</Canvas>
	)
}
