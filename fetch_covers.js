const animes = [
  { id: 1, title: "Naruto: Shippuuden" },
  { id: 2, title: "One Piece" },
  { id: 3, title: "Bleach" },
  { id: 4, title: "Dragon Ball Z" },
  { id: 5, title: "Boku no Hero Academia" },
  { id: 6, title: "Kimetsu no Yaiba" },
  { id: 7, title: "Jujutsu Kaisen" },
  { id: 8, title: "Hunter x Hunter" },
  { id: 9, title: "Fullmetal Alchemist: Brotherhood" },
  { id: 10, title: "Shingeki no Kyojin" }
];

async function getCovers() {
  for (const a of animes) {
    const query = `
    query ($search: String) {
      Media (search: $search, type: ANIME) {
        coverImage {
          extraLarge
        }
      }
    }
    `;
    const variables = {
      search: a.title
    };
    
    const url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    const res = await fetch(url, options);
    const data = await res.json();
    if (data.data && data.data.Media && data.data.Media.coverImage) {
      console.log(`${a.id}|${data.data.Media.coverImage.extraLarge}`);
    } else {
      console.log(`${a.id}|not found`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}
getCovers();
