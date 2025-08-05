import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Avatar } from '../ui/Avatar';

interface Interaction {
  id: string;
  type: 'Call' | 'Meeting' | 'Email' | 'Note';
  date: Date;
  summary: string;
  personnel: {
    name: string;
    avatar: string;
  };
}

interface InteractionLogProps {
  interactions: Interaction[];
}

export function InteractionLog({ interactions }: InteractionLogProps) {
  const formatInteractionDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-GB', options);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Interaction Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {interactions.length === 0 ? (
          <p className="text-center text-gray-500">No interactions logged yet.</p>
        ) : (
          interactions.map(interaction => (
            <div key={interaction.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start gap-4">
                <Avatar src={interaction.personnel.avatar} fallback={interaction.personnel.name.substring(0, 2)} className="w-10 h-10 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{interaction.personnel.name}</span>
                    <span className="text-sm text-gray-500">{formatInteractionDate(new Date(interaction.date))}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                      <span className="font-semibold mr-2">{interaction.type}:</span>
                      <p className="text-gray-700">{interaction.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}