#include<iostream>
using namespace std;
int main()

{
   
int x, count=0;
float sum;
cout<<"please emter some integers:\n"<<endl;
while(cin>>x)
sum+=x;
++count;
cout<<"the average of the numbers:"<<sum/count<<endl;
return 0;

}