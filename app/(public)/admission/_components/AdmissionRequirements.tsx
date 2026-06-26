"use client";

import { motion } from "framer-motion";
import { classGroups, generalRequirements, requiredDocuments } from "../_data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, Clock } from "lucide-react";

export default function AdmissionRequirements() {
  return (
    <section className="bg-gray-50 py-20 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#1B3A5C] sm:text-4xl">
            Admission Requirements
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Requirements vary by class level. Select a class group to see
            specific requirements.
          </p>
        </motion.div>

        <div className="mt-12">
          <Tabs defaultValue={classGroups[0].title} className="w-full">
            <TabsList className="mx-auto mb-8 flex w-fit flex-wrap justify-center gap-1">
              {classGroups.map((group) => (
                <TabsTrigger key={group.title} value={group.title}>
                  {group.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {classGroups.map((group) => (
              <TabsContent key={group.title} value={group.title}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-8 lg:grid-cols-2"
                >
                  {/* Class Info */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <Badge variant="default">
                          {group.title}
                        </Badge>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {group.ageRange}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-[#1B3A5C]">
                        Available Classes
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.levels.map((level) => (
                          <Badge
                            key={level}
                            variant="secondary"
                          >
                            {level}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="mt-6 text-lg font-semibold text-[#1B3A5C]">
                        Specific Requirements
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {group.requirements.map((req, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* General Requirements */}
                  <div className="space-y-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1B3A5C]">
                          <FileText className="h-5 w-5 text-amber-500" />
                          General Requirements
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {generalRequirements.map((req, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-[#1B3A5C]">
                          <FileText className="h-5 w-5 text-amber-500" />
                          Required Documents
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {requiredDocuments.map((doc, i) => (
                            <li
                              key={i}
                              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-800"
                            >
                              <span className="text-gray-700 dark:text-gray-300">
                                {doc.name}
                              </span>
                              <Badge variant="secondary">
                                {doc.formats}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}