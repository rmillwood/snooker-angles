{-# LANGUAGE OverloadedStrings #-}
module Board (board) where

import Data.Monoid
import Text.Blaze
import Text.Blaze.Svg11
import Text.Blaze.Svg11.Attributes hiding(path)

screenWidth = boardWidth + borderWidth*2 + 40
screenHeight = boardHeight + borderWidth*2 + 40

boardX = (screenWidth - boardWidth) / 2
boardY = (screenHeight - boardHeight) / 2
boardHeight = 240
boardWidth = boardHeight * 2
boardCentreX = boardX + boardWidth / 2
boardCentreY = boardY + boardHeight / 2

borderWidth = 16
borderRounded = 4

ballRadius = 5
ballX = boardX + boardWidth / 4
ballY = boardCentreY

lineX = boardX + 29 / 140 * boardWidth
dRadius = 11.5 / 140 * boardWidth
dotRadius = 1
blackDotX = boardX + boardWidth * (1 - 12.75 / 140)

pocketRadius = ballRadius * 1.6
pocketNudge = 2

toD :: Rational -> Double
toD = fromRational

i :: Rational -> AttributeValue
i = toValue . toD

board :: Markup
board = svg
  ! customAttribute "xmlns" "http://www.w3.org/2000/svg"
  ! width (i screenWidth) ! height (i screenHeight) $ do 
  rect
    ! id_ "border"
    ! x (i (boardX - borderWidth))
    ! y (i (boardY - borderWidth))
    ! width (i (boardWidth + 2*borderWidth))
    ! height (i (boardHeight + 2*borderWidth))
    ! rx (i borderRounded) ! ry (i borderRounded)
  rect
    ! id_ "board"
    ! x (i boardX)
    ! y (i boardY)
    ! width (i boardWidth)
    ! height (i boardHeight)
  line
    ! class_ "marking"
    ! x1 (i lineX) ! x2 (i lineX)
    ! y1 (i boardY) ! y2 (i (boardY + boardHeight))
  path ! class_ "marking"
    ! d (toValue . concat $ [
      "M", show (toD lineX), ",", show . toD $ boardCentreY - dRadius,
      " a", show (toD dRadius), ",", show (toD dRadius), " 0,0 ",
      "0.0", ",", show (toD (2 * dRadius))])
  mconcat $ do
    x <- [boardCentreX, boardCentreX + boardWidth / 4, blackDotX]
    return $ circle ! class_ "markingdot"
      ! r (i dotRadius)
      ! cx (i x)
      ! cy (i boardCentreY)
  mconcat $ do
    x <- [boardX + pocketNudge,
        boardCentreX,
        boardX + boardWidth - pocketNudge]
    y <- [boardY + pocketNudge, boardY + boardHeight - pocketNudge]
    return $ circle ! class_ "pocket"
      ! r (i pocketRadius) ! cx (i x) ! cy (i y)
  circle
    ! id_ "ball" ! r (i ballRadius) ! cx (i ballX) ! cy (i ballY)
