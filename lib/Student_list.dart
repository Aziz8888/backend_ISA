import 'package:flutter/material.dart';

class StudentList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 411,
          height: 869,
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(color: Color(0xFFF4F2F6)),
          child: Stack(
            children: [
              Positioned(
                left: 0,
                top: -3,
                child: Container(
                  width: 411,
                  height: 872,
                  child: Stack(
                    children: [
                      Positioned(
                        left: 0,
                        top: 0,
                        child: Container(
                          width: 411,
                          height: 872,
                          decoration: ShapeDecoration(
                            gradient: LinearGradient(
                              begin: Alignment(0.00, -1.00),
                              end: Alignment(0, 1),
                              colors: [Color(0xFFDF0B0B), Color(0x00F6F1FB)],
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(18),
                            ),
                          ),
                        ),
                      ),
                      Positioned(
                        left: 0,
                        top: 0,
                        child: Container(
                          width: 411,
                          height: 108.27,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment(0.00, -1.00),
                              end: Alignment(0, 1),
                              colors: [Color(0xFFDF0B0B), Color(0x00F6F1FB)],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              Positioned(
                left: 285,
                top: 25,
                child: Container(
                  width: 52,
                  height: 52,
                  decoration: ShapeDecoration(
                    color: Color(0x5BFB7D54),
                    shape: OvalBorder(),
                  ),
                ),
              ),
              Positioned(
                left: 6,
                top: 8,
                child: Container(
                  width: 129,
                  height: 117,
                  decoration: ShapeDecoration(
                    color: Color(0x5BFB7D54),
                    shape: OvalBorder(),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
