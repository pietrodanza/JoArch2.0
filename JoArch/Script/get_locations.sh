#! /bin/sh
echo "constants {"
vars=$(env | grep ^JDEP_ | tr "=" "\n")
length=$(env | grep ^JDEP_ | tr "=" "\n" | wc -l )
value=0
index=0
for v in $vars
do
  if [ $value -eq 0 ]
    then
      echo -n $v"="
      value=1
      index=$(($index+1))
    else
      echo -n "\""$v"\""
      value=0
      index=$(($index+1))
      if [ $index -ne $length ]
        then
          echo ","
      fi
  fi
done
echo
echo "}"
