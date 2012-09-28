{-# LANGUAGE OverloadedStrings #-}
module Main where

import qualified Data.Text.Lazy.IO as TL
import Text.Blaze.Html5
import qualified Text.Blaze.Html5.Attributes as A
import Text.Blaze.Renderer.Text

import Prelude hiding(head)

import Board

main :: IO ()
main = TL.writeFile "snooker.html" (renderMarkup htmlFile)

htmlFile :: Html
htmlFile = docTypeHtml $ do
  head $ do
    meta ! A.httpEquiv "Content-Type" ! A.content "text/html;charset=UTF-8"
    title "Snooker game!"
    link ! A.rel "stylesheet" ! A.type_ "text/css" ! A.href "snooker.css"
    script ! A.type_ "application/javascript" ! A.src "snooker.js" $ do
      ""
  body $ do
    board
    br
    button ! A.type_ "button" ! A.id "takeShot" ! A.disabled "disabled" $
      "Take a shot!"
