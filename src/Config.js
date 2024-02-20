export const config = async (appId,tenantId) => {
    return{
    appId: appId,
    redirectUrl: 'http://localhost:3000',
    scopes: [
        'user.read'
    ],
    authority: `https://login.microsoftonline.com/${tenantId}`
}
};