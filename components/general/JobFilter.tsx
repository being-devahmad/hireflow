import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Separator } from "@radix-ui/react-select";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { countryList } from "@/utils/countriesList";
import { Input } from "../ui/input";

const jobTypes = ["full-time", "part-time", "contract", "internship"];

const JobFilters = () => {
  return (
    <>
      <Card className="col-span-1 h-fit">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold">Filter</CardTitle>
            <Button
              variant="destructive"
              size="sm"
              className="h-8"
              // onClick={clearFilters}
            >
              <span className="mr-2">Clear all</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Separator />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Job Type</Label>
            <div className="grid grid-cols-2 gap-4">
              {jobTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox id={type.toLowerCase()} />
                  <Label
                    htmlFor={type.toLowerCase()}
                    className="text-sm font-medium"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator  />
          <div className="space-y-4">
          <Label className="text-lg font-semibold">Location</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Worldwide</SelectLabel>
                <SelectItem value="worldwide">
                  <span>🌍</span>
                  <span className="pl-2">Worldwide / Remote</span>
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Location</SelectLabel>
                {countryList.map((country) => (
                  <SelectItem value={country.name} key={country.name}>
                    <span>{country.flagEmoji}</span>
                    <span className="pl-2">{country.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Separator />

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Salary Range</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary" className="text-sm">
                Min Salary
              </Label>
              <Input
                id="minSalary"
                type="number"
                placeholder="0"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSalary" className="text-sm">
                Max Salary
              </Label>
              <Input
                id="maxSalary"
                type="number"
                placeholder="500,000"
                className="w-full"
              />
            </div>
          </div>
        </div>

        </CardContent>
      </Card>
    </>
  );
};

export default JobFilters;
