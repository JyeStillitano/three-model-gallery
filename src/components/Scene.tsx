"use client"

import * as THREE from "three"

import { Canvas, useFrame } from "@react-three/fiber"
import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

import { Backdrop } from "@react-three/drei"

import { easing } from "maath"

const simplify = true

function Background() {
	return (
		<>
			<mesh position={[0, 20, 0]} receiveShadow>
				<boxGeometry args={[100, 40, 40]} />
				<meshStandardMaterial side={THREE.BackSide} />
			</mesh>
			<Backdrop
				scale={[100, 5, 5]}
				position={[0, 0, -18]}
				floor={5} // Stretches the floor segment, 0.25 by default
				segments={20} // Mesh-resolution, 20 by default
				receiveShadow={true}
			>
				<meshStandardMaterial color="white" />
			</Backdrop>
			<Backdrop
				scale={[100, 5, 5]}
				position={[0, 0, 18]}
				rotation={[0, Math.PI, 0]}
				floor={5} // Stretches the floor segment, 0.25 by default
				segments={20} // Mesh-resolution, 20 by default
				receiveShadow={true}
			>
				<meshStandardMaterial color="white" />
			</Backdrop>
		</>
	)
}

function Lighting() {
	return (
		<>
			<ambientLight intensity={0.6} />
			<pointLight
				position={[3, 5, 3]}
				intensity={100}
				distance={20}
				decay={2}
				castShadow
				shadow-mapSize-width={2048} // Increase resolution
				shadow-mapSize-height={2048}
			/>
		</>
	)
}

function Computer() {
	const model = useLoader(GLTFLoader, "/computer/scene.gltf")

	if (simplify)
		return (
			<mesh position={[0, 1.5, 0]} castShadow>
				<boxGeometry args={[3, 3, 3]} />
				<meshStandardMaterial />
			</mesh>
		)

	model.scene.traverse((child) => {
		if ((child as THREE.Mesh).isMesh) {
			const mesh = child as THREE.Mesh
			mesh.castShadow = true
		}
	})

	return (
		<mesh position={[0, 0, 0]} castShadow>
			<primitive object={model.scene} />
			<meshStandardMaterial />
		</mesh>
	)
}

function Mailbox() {
	const model = useLoader(GLTFLoader, "/computer/scene.gltf")

	if (simplify)
		return (
			<mesh position={[0, 1.5, 0]} castShadow>
				<boxGeometry args={[3, 3, 3]} />
				<meshStandardMaterial />
			</mesh>
		)

	model.scene.traverse((child) => {
		if ((child as THREE.Mesh).isMesh) {
			const mesh = child as THREE.Mesh
			mesh.castShadow = true
		}
	})

	return (
		<mesh position={[0, 0, 0]} castShadow>
			<primitive object={model.scene} />
			<meshStandardMaterial />
		</mesh>
	)
}

export default function Scene() {
	// Camera Controller
	// https://codesandbox.io/p/sandbox/bst0cy?file=%2Fsrc%2FApp.js%3A40%2C51-40%2C59

	return (
		<Canvas shadows>
			{/* <PerspectiveCamera makeDefault position={[0, 5, 5]} zoom={0.3} /> */}
			{/* <OrbitControls enablePan={false} enableZoom={false} /> */}
			<CameraRig />
			<Lighting />
			<Computer />
			<Mailbox />
			<Background />
		</Canvas>
	)
}

function CameraRig() {
	useFrame((state, delta) => {
		easing.damp3(
			state.camera.position,
			[
				-1 + (state.pointer.x * state.viewport.width) / 3,
				(15 + state.pointer.y) / 2,
				10,
			],
			0.5,
			delta,
		)
		state.camera.lookAt(0, 0, 0)
	})
	return <></>
}
