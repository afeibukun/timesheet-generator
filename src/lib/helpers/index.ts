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

export const generateUniqueID = () => {
    let id = getRandomLetters(3) + getRandomDigits(4);
    return id;
};

export const getUniqueIDBasedOnTime = () => {
    const timestamp = Date.now();
    const randomDigits = Number(Array(timestamp.toString().length).fill(0).map(e => Math.floor(Math.random() * 10)).join(''));
    const mergedNumbers = timestamp + randomDigits;
    return mergedNumbers;
}

export const camelCaseToWords = (s: string): string => {
    const result = s.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export const titleize = (slug: string) => {
    var words = slug.split('-');

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }
    return words.join(' ');
}

export const capitalize = (sentence: string) => {
    const capitalizedSentence = sentence.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
    return capitalizedSentence
}