interface NavBellProps {
  lastTime: number;
  timeTillNextStep: number;
}

const NavInfo = ({
  lastTime,
    timeTillNextStep,
}: NavBellProps) => {
    return (
        <div
        className="flex items-center justify-between gap-4 px-3 py-3 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8"
        >
        <p className="text-sm font-medium">
            <span className="text-green-200">Last step:</span> {lastTime}
        </p>

        <p className="text-sm font-medium ">
            <span className="text-gray-400">{timeTillNextStep}</span>
        </p>
        </div>

    )
};

export default NavInfo;
