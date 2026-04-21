#include <iostream>
#include <fstream>
using namespace std;

class Employee {
public:
    int id;
    char name[20];
    float salary;

    void input() {
        cout << "Enter ID Name Salary: ";
        cin >> id >> name >> salary;
    }

    void display() {
        cout << "ID: " << id << endl;
        cout << "Name: " << name << endl;
        cout << "Salary: " << salary << endl;
        cout << "----------------------" << endl;
    }
};

int main() {
    Employee e;
    int ch, sid;
    bool found;

    do {
        cout << "\n1 Add\n2 Display\n3 Search\n4 Modify\n5 Exit\n";
        cout << "Enter choice: ";
        cin >> ch;

        if (ch == 1) {
            ofstream f("emp.dat", ios::binary | ios::app);
            e.input();
            f.write(reinterpret_cast<char*>(&e), sizeof(e));
            f.close();
        }

        else if (ch == 2) {
            ifstream f("emp.dat", ios::binary);

            if (!f) {
                cout << "File not found!\n";
                continue;
            }

            while (f.read(reinterpret_cast<char*>(&e), sizeof(e))) {
                e.display();
            }
            f.close();
        }

        else if (ch == 3) {
            ifstream f("emp.dat", ios::binary);
            cout << "Enter ID to search: ";
            cin >> sid;

            found = false;

            while (f.read(reinterpret_cast<char*>(&e), sizeof(e))) {
                if (e.id == sid) {
                    e.display();
                    found = true;
                }
            }

            if (!found)
                cout << "Record not found!\n";

            f.close();
        }

        else if (ch == 4) {
            fstream f("emp.dat", ios::binary | ios::in | ios::out);
            cout << "Enter ID to modify: ";
            cin >> sid;

            found = false;

            while (f.read(reinterpret_cast<char*>(&e), sizeof(e))) {
                if (e.id == sid) {
                    cout << "Enter new salary: ";
                    cin >> e.salary;

                    f.seekp(-sizeof(e), ios::cur);
                    f.write(reinterpret_cast<char*>(&e), sizeof(e));

                    found = true;
                    break;
                }
            }

            if (!found)
                cout << "Record not found!\n";

            f.close();
        }

    } while (ch != 5);

    return 0;
}