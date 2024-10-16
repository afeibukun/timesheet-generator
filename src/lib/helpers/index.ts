export const slugify = (str: string) => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export const getRandomDigits = (length: number = 1) => {
    return Array(length).fill(0).map(e => Math.floor(Math.random() * 10)).join('');
}

export const getRandomLetters = (length: number = 1) => Array(length).fill('').map(e => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');

// const existingIDs = ['AA1111','XY1234'];
export const generateUniqueID = () => {
    let id = getRandomLetters(3) + getRandomDigits(4);
    // while (existingIDs.includes(id)) id = getRandomLetters(2) + getRandomDigits(4);
    return id;
};

export const getUniqueIDBasedOnTime = () => {
    const timestamp = Date.now();
    const randomDigits = Number(Array(timestamp.toString().length).fill(0).map(e => Math.floor(Math.random() * 10)).join(''));
    const mergedNumbers = timestamp + randomDigits;
    return mergedNumbers;
}