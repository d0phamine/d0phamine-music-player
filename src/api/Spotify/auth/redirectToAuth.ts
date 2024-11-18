export const redirectToAuth = async (clientId: string) => {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    // Сохраняем verifier
    localStorage.setItem("verifier", verifier);

    const scopes = [
        'ugc-image-upload',
        'streaming',
      
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
      
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private',
        'playlist-read-collaborative',
      
        'user-follow-modify',
        'user-follow-read',
      
        'user-read-playback-position',
        'user-top-read',
        'user-read-recently-played',
      
        'user-library-read',
        'user-library-modify',
      ] as const

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:3000");
    params.append("scope", scopes.join(' '));
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

const generateCodeVerifier = (length: number) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const generateCodeChallenge = async (codeVerifier: string) => {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}