import 'package:flutter/material.dart';
import 'package:math_expressions/math_expressions.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark(),
      home: ScientificCalculator(),
    );
  }
}

class ScientificCalculator extends StatefulWidget {
  @override
  _ScientificCalculatorState createState() => _ScientificCalculatorState();
}

class _ScientificCalculatorState extends State<ScientificCalculator> {
  String input = '';
  String result = '0';

  void _onPressed(String buttonText) {
    setState(() {
      if (buttonText == 'C') {
        input = '';
        result = '0';
      } else if (buttonText == '⌫') {
        if (input.isNotEmpty) {
          input = input.substring(0, input.length - 1);
        }
      } else if (buttonText == '=') {
        try {
          // Automatically close unbalanced parentheses
          int openParentheses = '('.allMatches(input).length;
          int closeParentheses = ')'.allMatches(input).length;
          input += ')' * (openParentheses - closeParentheses);

          Parser p = Parser();
          Expression exp = p.parse(input);
          ContextModel cm = ContextModel();
          double eval = exp.evaluate(EvaluationType.REAL, cm);

          // Check for division by zero
          if (eval.isInfinite) {
            result = 'Error';
          } else {
            result = eval.toString();
          }
        } catch (e) {
          result = 'Error';
        }
      } else if (buttonText == '√') {
        input += 'sqrt(';
      } else if (buttonText == 'sin' ||
          buttonText == 'cos' ||
          buttonText == 'tan') {
        input += '$buttonText(';
      } else {
        input += buttonText;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(child: Text('Scientific Calculator')),
      ),
      body: Column(
        children: [
          // Display Section
          Container(
            height: 150, // Fixed height for the display
            padding: EdgeInsets.all(20),
            alignment: Alignment.bottomRight,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  input,
                  style: TextStyle(color: Colors.white, fontSize: 24),
                ),
                SizedBox(height: 10),
                Text(
                  result,
                  style: TextStyle(color: Colors.green, fontSize: 36),
                ),
              ],
            ),
          ),
          // Buttons Section
          Expanded(
            child: SingleChildScrollView(
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 10),
                child: Column(
                  children: [
                    _buildButtonRow(['sin', 'cos', 'tan', '√']),
                    _buildButtonRow(['7', '8', '9', '/']),
                    _buildButtonRow(['4', '5', '6', '*']),
                    _buildButtonRow(['1', '2', '3', '-']),
                    _buildButtonRow(['C', '0', '⌫', '+']),
                    _buildButtonRow(['=']),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildButtonRow(List<String> buttons) {
    return Row(
      children: buttons.map((button) {
        return Expanded(
          child: Padding(
            padding: const EdgeInsets.all(5.0), // Reduced padding
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.grey[800],
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(vertical: 15), // Reduced padding
              ),
              onPressed: () => _onPressed(button),
              child: Text(
                button,
                style: TextStyle(fontSize: 18), // Reduced font size
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}