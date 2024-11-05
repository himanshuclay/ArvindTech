const getRandomDarkColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        // Generate a random value in the range of 0 to 128 to ensure darker colors
        const value = Math.floor(Math.random() * 128);
        color += letters[value % 16]; // Convert to hex
    }
    return color;
};

const IconWithLetter: React.FC<{ letter: string }> = ({ letter }) => {
    const randomColor = getRandomDarkColor();
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
                opacity: '1'
            }}
        >
            {letter.toUpperCase()} {/* Display the letter in uppercase */}
        </div>
    );
};

export default IconWithLetter;
