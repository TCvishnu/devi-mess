const BackgroundLayer: React.FC = () => {
	return (
		<div className=" flex flex-col w-full h-[max(100vh,100vw)] lg:h-full  absolute top-0 left-0 -z-50">
			<div className=" w-full h-1/2 bg-primary shapedividers"></div>
			<div className=" w-full h-1/2 bg-white "></div>
		</div>
	)
}

export default BackgroundLayer
