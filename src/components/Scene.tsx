"use client"

// React Three Fiber Imports
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { useLoader } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import {
	EffectComposer,
	Outline,
	DotScreen,
	Pixelation,
	Scanline,
} from "@react-three/postprocessing"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

// Import performance monitor.
import { Perf } from "r3f-perf"

import { easing } from "maath"

import { clamp } from "../util/Clamp"
import { useRef, useState } from "react"

// Easing Camera - Look At Mouse
function Camera() {
	const defaultPosition: THREE.Vector3 = new THREE.Vector3(0, 10, 12)
	const closeupPosition: THREE.Vector3 = new THREE.Vector3(0, 5, 6)
	const currentPosition: THREE.Vector3 = defaultPosition
	const targetPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0)

	useFrame((state, delta) => {
		targetPosition.set(
			currentPosition.x +
				clamp((state.pointer.x * state.viewport.width) / 3, -10, 10),
			currentPosition.y + state.pointer.y,
			currentPosition.z,
		)

		easing.damp3(state.camera.position, targetPosition, 0.5, delta)
		state.camera.lookAt(0, 5, 0)
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
			<ambientLight intensity={1} />
			<pointLight
				position={[2, 5, 3]}
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
	const [hovered, setHovered] = useState(false)
	const ref = useRef<THREE.Mesh | null>(null)
	// Load gameboy model.
	const model = useLoader(GLTFLoader, "/gameboy/scene.gltf")

	// Configure shadows for all meshes.
	model.scene.traverse((child) => {
		if ((child as THREE.Mesh).isMesh) {
			const mesh = child as THREE.Mesh
			mesh.castShadow = true
		}
	})

	useFrame((_, delta) => {
		if (ref.current) {
			if (hovered)
				easing.dampE(ref.current?.rotation, [0, Math.PI * 4, 0], 0.5, delta)
			else easing.dampE(ref.current?.rotation, [0, Math.PI, 0], 0.5, delta)
		}
	})

	// Scale and return primitive object.
	return (
		<mesh
			position={[0.25, 4, 1]}
			rotation={[0, Math.PI, 0]}
			scale={[0.5, 0.5, 0.5]}
			castShadow
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			ref={ref}
		>
			<primitive object={model.scene} />
			<meshBasicMaterial />
		</mesh>
	)
}

function Information() {
	return (
		<>
			<Text
				color="white"
				font="/fonts/AtkinsonHyperlegibleMono-VariableFont_wght.ttf"
				fontSize={1.5}
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
				position={[-5, 5, 0.75]}
				rotation={[-0.5, 0, 0]}
				maxWidth={5}
			>
				With a dot-matrix screen plus standard controls you'll recognize, the
				GAME BOY is capable of playing a wide range of games using
				interchangable cartridges.
			</Text>
			<Text
				color="white"
				font="/fonts/AtkinsonHyperlegibleMono-VariableFont_wght.ttf"
				fontSize={0.5}
				anchorX="center"
				position={[6, 5, 0.75]}
				rotation={[-0.5, 0, 0]}
				maxWidth={5.5}
			>
				Including a video link for 2-player competition, stereo headphones,
				external speaker and battery, you can take the GAME BOY to the beach,
				park or playground.
			</Text>

			<Text
				color="white"
				font="/fonts/AtkinsonHyperlegibleMono-VariableFont_wght.ttf"
				fontSize={1.5}
				anchorX="center"
				position={[1, 0.1, 3.5]}
				rotation={[-Math.PI / 2, 0, 0]}
			>
				Wherever. Whenever.
			</Text>
		</>
	)
}

// Simple model for debugging.
function Box() {
	return (
		<mesh position={[0, 5, 0]}>
			<boxGeometry args={[2, 2, 2]} />
			<meshStandardMaterial />
			{/* <Outlines thickness={10} color="hotpink" /> */}
		</mesh>
	)
}

export default function Scene() {
	//const [focused, outline] = useState(false)
	// Camera Controller
	// https://codesandbox.io/p/sandbox/bst0cy?file=%2Fsrc%2FApp.js%3A40%2C51-40%2C59

	// Good example of decreasing quality on demand:
	// https://codesandbox.io/p/sandbox/szj6p7?file=%2Fsrc%2FApp.js%3A111%2C16-111%2C25

	return (
		<Canvas shadows>
			<Camera />
			<Lighting />

			<Information />
			<Background />
			<EffectComposer autoClear={false}>
				{/* <Scanline density={2} /> */}
				{/* <Pixelation granularity={50} /> */}
				{/* <DotScreen scale={2} /> */}
				<Outline />
			</EffectComposer>
			<Gameboy />

			<Perf position="top-right" />
		</Canvas>
	)
}
