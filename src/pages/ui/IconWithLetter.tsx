const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const IconWithLetter: React.FC<{ letter: string }> = ({ letter }) => {
    const randomColor = getRandomColor();
    return (
        <div
            className="letter-icon"
            style={{
                backgroundColor: randomColor,
                color: '#fff',
                width: '30px', // Adjust width and height
                height: '30px',
                borderRadius: '50%', // Make it circular
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                marginRight: '8px',
                opacity: '0.6'
            }}
        >
            {letter.toUpperCase()} {/* Display the letter in uppercase */}
        </div>
    );
};


export default IconWithLetter;