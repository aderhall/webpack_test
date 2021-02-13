export function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex, newArray = [...array];
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = newArray[currentIndex];
      newArray[currentIndex] = newArray[randomIndex];
      newArray[randomIndex] = temporaryValue;
    }
  
    return newArray;
}

export function getData(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = () => callback(xhr);
    xhr.send();
}

export const staticStore = {
    setPage: () => {},
    setRoute: () => {},
    myId: 3
}