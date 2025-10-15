const Action = ({action, command}) => {
    return (
        <div >
            <button
                className="text-3xl text-accent  hover:cursor-pointer"
                onClick={command}
            >
                {action}
            </button>
        </div>
    )
}

export default Action
