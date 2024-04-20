import Foundation;

srandom(UInt32(NSDate().timeIntervalSince1970))

public class Game
{
  ////////////////////////////////
  // attributes and properties. //
  ////////////////////////////////
  
  private let BOARD_SIZE : Int = 5
  // an array for the pord
  private var board : [[String]]
  // variables for the players.
  private var playerX : PlayerX 
  private var playerO : PlayerO
  // Holds an array of the current players in the order of their turns.
  private var players: [Player]
  // keeps a count of the turns in the current round
  private var turn = 0

  // This property will get the current player from the players list
  public var currentPlayer : Player { get { return self.players[self.turn % 2] } }

  /////////////////////////////////////
  // Constructor for the game object //
  /////////////////////////////////////
  public init()
  {
    // Initializes the players
    self.playerO = PlayerO()
    self.playerX = PlayerX()
    // initializes the players array.
    self.players = [self.playerX, self.playerO]
    // initializes the board
    self.board  = Array(repeating: Array(repeating: "-", count: self.BOARD_SIZE), count: self.BOARD_SIZE)
  }

  /////////////////////////
  // Board setup methods //
  ////////////////////////
  
  // Sets the order of players to be called in the game
  private func setPlayerOrder() -> [Player]
  {
    // gets a random number
    let iRand = Int.random(in: 0...1)
    // returns the players in a random order.
    return iRand == 0 ? [self.playerX, self.playerO] : [self.playerO, self.playerX]
  }

  // resets the game for a new round
  private func initializeRound()
  {
    // sets the turns to 0
    self.turn = 0
    // randomizes the players order.
    self.players = self.setPlayerOrder()
    // resets the board
    self.resetBoard()
    // prints a space
    print("")
    // prints the players scores.
    print(self.players[0])
    print(self.players[1], "\n")
    // prints out something so that the players can see the game is ready to play.
    print("\n==========================\nRound Start\n==========================\n")
    // prints the grid
    self.printGrid()
    print("Good luck!")
  }

  // resets the board to all "-"s
  private func resetBoard()
  {
    self.board  = Array(repeating: Array(repeating: "-", count: self.BOARD_SIZE), 
                        count: self.BOARD_SIZE)
  }

  // this method draws the board on the console
  public func printGrid()
  {
    var grid = "   ";
    var rCount = 0;
    // adds numbers on the top row for corrdinates
    for i in 0...board.count-1
    {
      grid += " " + String(i) + " ";
    }
    grid += "\n";
    // loops through board to add all of the 2d array to grid string so it can being printed
    for row in board
    {
      grid += " " + String(rCount) + " "
      // adds numbers on the left column for corrdinates
      rCount += 1
      for col in row
      {
        grid += " " + col + " ";
      }
      grid += "\n";
    }
    print( grid);
  }

  // this method places the current player's token on the board
  public func place(row: Int, col: Int)-> Bool
  {
    // checks if the row and col are within the bounds of the board
    if (col < 0 || col > 4 || row < 0 || row > 4)
    {
      // gives error message to player and returns false
      print("Invalid coordinates");
      print("Coordinates out of Bounds")
      return false
    }
    // checks if the space is already taken
    if (board[row][col] == "-")
    {
      // places the token on the board and returns true
      board[row][col] = self.currentPlayer.playerType;
      return true
    }
    else
    {
      // gives error message to player and returns false
      print("Invalid coordinates");
      print("Cell already occupied");
      return false
    }
  }

  //////////////////////////////////////////////////
  // Methods for checking for end game scenarios. //
  //////////////////////////////////////////////////
  
  // This method checks the win state for the current player
  // and should be used at the end of the players turn
  public func checkWin() -> Bool
  {
    var winner = false
    // Check rows
    winner = checkRows()
    winner = winner ? true : checkCols()
    winner = winner ? true : checkForwardDiagonals()
    winner = winner ? true : checkBackwardDiagonals()


    return winner
  }

  // This method checks to see if the game is a tie
  public func checkTie() -> Bool
  {
    return self.turn == 25
  }
  
  // this method checks all the forward diagonals for a win
  private func checkForwardDiagonals() -> Bool
  {
    var winner = false
    // Check forward diagonals stating from row 0-2
    for row in 0...2
    {
      winner = checkForwardDiagonal(row: row, col: 0)
      // checks if there is a winner
      if(winner)
      {
        return true
      }
    }
    // Check forward diagonals stating from col 1-2
    for col in 1...2
    {
      winner = checkForwardDiagonal(row: 0, col: col)
      // checks if there is a winner
      if (winner)
      {
        return true
      }
    }
    return false
  }

  // This method checks a forward diagonal to see if they have 3 in a row
  private func checkForwardDiagonal(row: Int, col: Int) -> Bool
  {
    var counter = 0
    var iCol = col
    //loops through the diagonal
    for iRow in row...4
    {
      // checks if current position is the players piece
      if (board[iRow][iCol] == self.currentPlayer.playerType)
      {
        // if so, increment the counter
        counter += 1
      }
      else
      {
        // if not, reset the counter
        counter = 0
      }
      // if the counter is 3 (three in a row), return true
      if (counter == 3)
      {
        return true
      }
      // increment the column
      iCol += 1
      // if the column is out of bounds, end loop
      if (iCol > 4)
      {
        break
      }
    }
    return false
  }

  // this method checks all the backward diagonals for a win
  private func checkBackwardDiagonals() -> Bool
  {
    var winner = false
    // Check backward diagonals stating from row 0-2
    for row in 0...2
    {
      winner = checkBackwardDiagonal(row: row, col: 4)
      // checks if there is a winner
      if(winner)
      {
        return true;
      }
    }
    // Check backward diagonals stating from col 2-3
    for col in 2...3
    {
      winner = checkBackwardDiagonal(row: 0, col: col)
      // checks if there is a winner
      if (winner)
      {
        return true
      }
    }
    return false
  }

  // This method checks a backwards diagonal to see if they have 3 in a row
  private func checkBackwardDiagonal(row: Int, col: Int) -> Bool
  {
 
    var counter = 0
    var iRow = row
    //loops through the col counting down
    for iCol in stride(from: col, through: 0, by: -1)
    {
      // checks if current position is the players piece
      if (board[iRow][iCol] == self.currentPlayer.playerType)
      {
        counter += 1;
      }
      else
      {
        counter = 0;
      }
      // if the counter is 3 (three in a row), return true
      if (counter == 3)
      {
        return true
      }
      // goes to next row
      iRow += 1;
      // if the row is out of bounds, end loop
      if (iRow > 4)
      {
        break
      }
    }
    return false
  }
  
  // This method if there is a win for the current player in the columns
  private func checkCols() -> Bool
  {
    // a counter to hold the amount of squares the current player has in a row.
    var counter = 0
    // For each column
    for col in 0...4
    {
      // for each row in the column
      for row in board
      {
        // if the player owns the column the increment their count.
        if row[col] == self.currentPlayer.playerType
        {
          counter += 1
        }
        // else set their count to 0
        else
        {
          counter = 0
        }
        // if the count equals 3 they win return true
        if counter == 3
        {
          return true
        }
      }
    }
    // they never had 3 in a row return 0
    return false
  }

  // This method if there is a win for the current player in the rows
  private func checkRows() -> Bool
  {
    // a counter to hold the amount of squares the current player has in a row.
    var counter = 0
    // for each row on the board
    for row in board
    {
      // for each column in the row
      for col in row
      {
        // if the value in the column equals the player's symbol
        if col == self.currentPlayer.playerType
        {
          // increases the characters counter
          counter += 1
        }
        // sets the characters counter into zero.
        else
        {
          counter = 0
        }
        // if the counter is three the player wins so return
        if counter == 3
        {
          return true
        }
      }
    }
    return false
  }
  
  ///////////////////////////////////
  // Methods for running the game. //
  ///////////////////////////////////
  
  // This method will return a string that discribes how to play the game.
  private static func getHelp()
  {
    var helpString : String = "\n==========================\nInstructions\n"
    helpString += "==========================\n"
    helpString += "To place your marker, enter the row and column number separated by a space.\n"
    helpString += "For example, to place your marker in the top left corner, enter 0 0\n"
    helpString += "To exit the game, enter the word 'quit'\n"
    helpString += "For to get instructions, enter 'help'.\n"
    print(helpString)
  }

  // This method will handle running the game
  // it will initialize the game randomizing who goes first
  // it will provie instructions to the user on how to place their marker
  // it will then prompt the first player (X or O) to place their first marker.
  // and will continue to loop between the players until they enter the exit key.
  static func startGame()
  {
    // create a new game
    let game = Game()
    
    // print the instructions
    //intro
    print("Welcome to Tic Tac Toe!\n==========================\n")
    Game.getHelp()

    game.initializeRound()

    var input : String = ""
    //while loop
    repeat {
     input = game.doTurn()
    } while input != "quit"
    print("")
    print(game.playerX)
    print(game.playerO)
    print("")

    print("Thanks for playing!")
  }


  // This method will handle the players turn
  private func doTurn() -> String
  {
    // get the players input
    print("It's your turn, " + self.currentPlayer.playerType + "!")
    print("Enter your move: ")
    let input = readLine()!
    // checks if help or quit was entered
    if input == "help"
    {
      Game.getHelp()
      return ""
    }
    else if input == "quit"
    {
      return input;
    }
    else
    {
      // split the input into an array
      let coordinates = input.split(separator: " ")
      //checks that there is exactly 2 items in the array
      if coordinates.count != 2
      {
        print("Invalid input, try again")
        return ""
      }
      // convert the array to ints
      let row = Int(coordinates[0])
      let col = Int(coordinates[1])
      // checks if the input is valid
      if row == nil || col == nil
      {
        print("Invalid input, try again")
        return ""
      }
      else
      {
        // if the move is a valid move
        if self.place(row: row!, col: col!)
        {
          // re print the grid with the newly placed symbol
          self.printGrid()
          // check if there is a win
          if self.checkWin()
          {
            // handles what happens with a win and returns the results.
            return self.handleWin()
          }
          // check if there is a tie
          else if self.checkTie()
          {
            return self.handleTie()
          } 
          // Increment the turn
          self.turn += 1;
        }
      }
      return ""
    }
  }

  // This method handles what happens when a tie occurs.
  private func handleTie() -> String
  {
    // prints the tie message
    print("It's a tie!")
    print("did you want to play again? (yes/quit)")
    // gets the players input
    var input = readLine()!
    // checks for invalid unput
    while input != "yes" && input != "quit"
    {
      print("INVALID INPUT!!!")
      print("did you want to play again? (yes/quit)")
      input = readLine()!
    }
    // if the player wants to play again
    if input == "yes"
    {
      //game is  reinitialize
      self.initializeRound()
      return ""
    }
    else // the returned input must be quit
    {
      return input;
    }
  }
  
  // this method will be used to handle what happens when there is a win.
  private func handleWin() -> String
  {
    self.currentPlayer.incrementScore()
    // prints the win message
    print("Congratulations! \(self.currentPlayer)!")
    print("did you want to play again? (yes/quit)")
    // gets the players input
    var input : String = readLine()!
    // checks for invalid unput
    while input != "yes" && input != "quit"
    {
      print("INVALID INPUT!!!")
      print("did you want to play again? (yes/quit)")
      input = readLine()!
    }
    // if the player wants to play again
    if input == "yes"
    {
      //game is  reinitialize
      self.initializeRound()
      return ""
    }
    else // the returned input must be quit
    {
      return input;
    }
  }
}




// This is the player class for the X player in a tic tac toe game
// implementing the Player super class and has a playerType of "X"
// and a description based around 
public class PlayerX : Player
{
  // The Players type is overriden and set to "X"
  public override var playerType: String { get { return "X" } }
}

// This is the player class for the O player in a tic tac toe game
// implementing the Player super class and has a playerType of "O"
// and a description based around 
public class PlayerO : Player
{
  // The Players type is overriden and set to "O"
  public override var playerType: String { get { return "O" } }
}

// This is the player class for the X player in a tic tac toe game
// that will store a players type and score, it will also implement
// CustomStringConvertible to easily convert the player to a string.
public class Player : CustomStringConvertible
{
  // base attribute so that it can be overridden in the players subclasses
  public var playerType: String { get { return "-" } }

  // attribute and property of the score.
  private var score : Int = 0
  public var Score : Int { get { return score }}

  // Empty initializer, players should allways start with the same stats.
  public init()
  {
    
  }

  // A description that prints out the player's type and their score.
  public var description: String
  {
    return "Player \(self.playerType) has \(self.score) win\(self.score > 1 ? "s" : "")"
  }

  // Increments their score.
  public func incrementScore()
  {
    self.score += 1
  }
}


// Starts the game.
Game.startGame()