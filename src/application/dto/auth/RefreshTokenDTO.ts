export type RefreshTokenDTOInput = {
    refreshToken: string;
}

export type RefreshTokenDTOOutput = {
    accessToken: string;
    refreshToken: string;
}